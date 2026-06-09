import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: undefined,
    alignSelf: 'center',
    padding: isWeb ? 20 : 20,
    backgroundColor: '#f5f5f5'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: isWeb ? 11 : 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    maxWidth: isWeb ? 460 : undefined,
    width: '100%',
    alignSelf: isWeb ? 'center' : 'auto'
  },
  button: {
    marginTop: 10
  },
  title: {
    fontSize: isWeb ? 24 : 22,
    fontWeight: 'bold',
    marginBottom: 15,
    maxWidth: isWeb ? 460 : undefined,
    width: '100%',
    alignSelf: isWeb ? 'center' : 'auto'
  },
  card: {
   width: '90%',
  backgroundColor: '#fff',
  margin: 8,
  padding: 15,
  borderRadius: 12,
  elevation: 3, // sombra Android
  shadowColor: '#000', // sombra iOS
  shadowOpacity: 0.1,
  shadowRadius: 5
},

cardTitle: {
  fontSize: 16,
  fontWeight: 'bold'
},

price: {
  color: 'green',
  fontWeight: 'bold',
  marginTop: 5
},

desc: {
  marginTop: 5,
  fontSize: 12,
  color: '#555'
},
cardML: {
  flex: 1,
  backgroundColor: '#fff',
  margin: 6,
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#eee',
  maxWidth: '48%', // 👈 clave para grid
},

titleML: {
  fontSize: 13,
  fontWeight: '500'
},
priceML: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#00a650', // verde ML
  marginTop: 5
},

descML: {
  fontSize: 12,
  color: '#777',
  marginTop: 4
},

actionsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10
},

});
