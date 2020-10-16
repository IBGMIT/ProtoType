
import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});

export default class ActivityDetails extends React.Component {
    state = { activity: null };

    componentDidMount() {
        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        const id = this.props.navigation.getParam('id');
        this.LoadActivity(id);
    }

    LoadActivity = id => {
        firebase
            .database()
            // ID fra funktionens argument sættes ind i stien vi læser fra
            .ref('/city/'+id)
            .on('value', asds => {
                this.setState({ activity: asds.val() });
            });
    };

    handleEdit = () => {
        // Vi navigerer videre til EditCar skærmen og sender ID med
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        navigation.navigate('editActivity', { id });
    };

    confirmDelete = () => {
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the car?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: this.handleDelete },
            ]);
        } else {
            if(confirm('Er du sikker på du vil slette denne aktivitet?')){
                this.handleDelete()
            }
        }
    };

    // Vi spørger brugeren om han er sikker

    // Vi sletter den aktuelle bil
    handleDelete = () => {
        const { navigation } = this.props;
        const id = navigation.getParam('id');
        try {
            firebase
                .database()
                // Vi sætter bilens ID ind i stien
                .ref(`/city/${id}`)
                // Og fjerner data fra den sti
                .remove();
            // Og går tilbage når det er udført
            navigation.goBack();
        } catch (error) {
            Alert.alert(error.message);
        }

    };

    render() {
        const { activty } = this.state;
        if (!activty) {
            return <Text>No data</Text>;
        }
        return (
            <View style={styles.container}>
                <Button title="Edit" onPress={this.handleEdit} />
                <Button title="Delete" onPress={this.confirmDelete} />
                <View style={styles.row}>
                    <Text style={styles.label}>Price</Text>
                    <Text style={styles.value}>{activty.price}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Activity</Text>
                    <Text style={styles.value}>{activty.activity}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Header</Text>
                    <Text style={styles.value}>{activty.header}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.value}>{activty.description}</Text>
                </View>
            </View>
        );
    }
}
