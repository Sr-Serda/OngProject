import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Button, Modal, View, TextInput, ScrollView, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [ongList, setOngList] = useState([]);
  const [ongData, setOngData] = useState({
    name: '',
    cnpj: '',
    latitude: -11,
    longitude: -50,
    specialty: ''
  });

   const handleCnpjChange = (text) => {
    const formattedCnpj = text.replace(/\D/g, '') // Remove non-digits
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'); // Format CNPJ

    setOngData({ ...ongData, cnpj: formattedCnpj });
  };

  const handleSave = () => {
    if (ongData.name && ongData.cnpj && ongData.latitude && ongData.longitude && ongData.specialty) {
      setOngList([...ongList, ongData]);
      setOngData({ name: '', cnpj: '', latitude: 0, longitude: 0, specialty: '' });
      setModalVisible(false);
    } else {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setOngData({ ...ongData, latitude, longitude });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ongData.latitude,
          longitude: ongData.longitude,
          latitudeDelta: 20.2,
          longitudeDelta: 46.0421,
        }}
        onPress={handleMapPress}
      >
        {ongList.map((ong, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: ong.latitude, longitude: ong.longitude }}
            title={ong.name}
          />
        ))}
      </MapView>
      <ScrollView>
      {ongList.map((ong, index) => (
        <Card key={index} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{ong.name}</Text>
            <Text>{`CNPJ: ${ong.cnpj}`}</Text>
            <Text>{`Especialidade: ${ong.specialty}`}</Text>
            <Text>{`Latitude: ${ong.latitude}`}</Text>
            <Text>{`Longitude: ${ong.longitude}`}</Text>
          </View>
        </Card>
      ))}
      <Button title="Adicionar ONG" onPress={() => setModalVisible(true)} />
      </ScrollView>
      {/* Modal para adicionar dados da ONG */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome da ONG"
              value={ongData.name}
              onChangeText={(text) => setOngData({ ...ongData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="CNPJ"
              value={ongData.cnpj}
              onChangeText={handleCnpjChange}
              maxLength={18} //?
            />
            <TextInput
              style={styles.input}
              placeholder="Latitude"
              value={ongData.latitude.toString()}
              onChangeText={(text) => setOngData({ ...ongData, latitude: parseFloat(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Longitude"
              value={ongData.longitude.toString()}
              onChangeText={(text) => setOngData
            ( {...ongData, longitude: parseFloat(text) })}
            />
            <TextInput
              style={styles.input}
              placeholder="Especialidade da ONG"
              value={ongData.specialty}
              onChangeText={(text) => setOngData({ ...ongData, specialty: text })}
              minLenght={1}
            />
            <MapView
              style={styles.miniMap}
              initialRegion={{
                latitude: ongData.latitude,
                longitude: ongData.longitude,
                latitudeDelta: 30.22,
                longitudeDelta: 46.21,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{ latitude: ongData.latitude, longitude: ongData.longitude }}
                draggable
                onDragEnd={(event) => setOngData({ ...ongData, latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude })}
              />
            </MapView>
            <Button title="Salvar" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginVertical: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    minWidth: 300,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  map: {
    height: 500, // ou qualquer altura desejada
    marginBottom: 10,
  }, 
   miniMap: {
    flex: 1,
    marginBottom: 10,
  },
});
