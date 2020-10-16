import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
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

export default class AddActivity extends React.Component {
    state = {
        price: '',
        activity: '',
        header: '',
        description: '',
    };

    handleBrandChange = text => this.setState({ price: text });

    handleModelChange = text => this.setState({ activity: text });

    handleYearChange = text => this.setState({ header: text });

    handleLicensePlateChange = text => this.setState({ description: text });

    handleSave = () => {
        const { price, activity, header, description } = this.state;
        try {
            const reference = firebase
                .database()
                .ref('/city/')
                .push({ price, activity, header, description });
            Alert.alert(`Saved`);
            this.setState({
                price: '',
                activity: '',
                header: '',
                description: '',
            });
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };

    render() {
        const { price, activity, header, description } = this.state;
        return (
            <SafeAreaView style={styles.container}>
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
                    <Button title="Add activity" onPress={this.handleSave} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
