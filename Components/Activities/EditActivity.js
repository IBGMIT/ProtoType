
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView
} from 'react-native';
import firebase from 'firebase';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: { fontWeight: 'bold', width: 100 },
    input: { borderWidth: 1, flex: 1 },
});

export default class EditActivity extends React.Component {
    state = {
        price: '',
        activity: '',
        header: '',
        description: '',
    };

    componentDidMount() {
        const id = this.props.navigation.getParam('id');
        this.loadActivity(id);
    }

    // Her loader vi bilens data ud fra det ID vi får med fra navigationen
    loadActivity = id => {
        firebase
            .database()
            .ref('/city/'+id)
            .once('value', dataObject => {
                const activity1 = dataObject.val();
                const { price, activity, header, description } = activity1;
                this.setState({ price, activity, header, description});
            });
    };

    handleBrandChange = text => this.setState({ price: text });

    handleModelChange = text => this.setState({ activity: text });

    handleYearChange = text => this.setState({ header: text });

    handleLicensePlateChange = text => this.setState({ description: text });

    updateData = () => {
        // Vi bruger this.props.navigation flere steder så vi pakker den ud én gang for alle
        const { navigation } = this.props;
        const { price, activity, header, description } = this.state;
        const id = navigation.getParam('id');
        try {
            firebase
                .database()
                .ref(`/city/${id}`)
                // Vi bruger update, så kun de felter vi angiver, bliver ændret
                .update({ price, activity, header, description });
            // Når bilen er ændret, går vi tilbage.
            Alert.alert("Din info er nu opdateret");
            navigation.goBack();
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { price, activity, header, description } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            value={price}
                            onChangeText={this.handleBrandChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Activity</Text>
                        <TextInput
                            value={activity}
                            onChangeText={this.handleModelChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Header</Text>
                        <TextInput
                            value={header}
                            onChangeText={this.handleYearChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={this.handleLicensePlateChange}
                            style={styles.input}
                        />
                    </View>
                    <Button title="Press to update car info" onPress={this.updateData} />
                </ScrollView>
            </View>
        );
    }
}
