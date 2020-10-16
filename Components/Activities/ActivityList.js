
import * as React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

import ActivityListItem from './ActivityListItem';

export default class ActivityList extends React.Component {
    state = {
        activities: {},
    };

    componentDidMount() {
        firebase
            .database()
            .ref('/city')
            .on('value', snapshot => {
                this.setState({ activities: snapshot.val() });
            });
    }

    handleSelectActivity = id => {
        this.props.navigation.navigate('ActivityDetails', { id });
    };

    render() {
        const { activities } = this.state;
        // Vi viser ingenting hvis der ikke er data
        if (!activities) {
            return null;
        }
        // Flatlist forventer et array. Derfor tager vi alle values fra vores cars objekt, og bruger som array til listen
        const ActivityArray = Object.values(activities);
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        const ActivityKeys = Object.keys(activities)
        return (
            <View>
                <FlatList
                    data={ActivityArray}
                    // Vi bruger ActivityKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
                    keyExtractor={(item, index) => ActivityKeys[index]}
                    renderItem={({ item, index }) => (
                        <ActivityListItem
                            activity={item}
                            id={ActivityKeys[index]}
                            onSelect={this.handleSelectActivity}
                        />
                    )}
                />
            </View>
        );
    }
}
