import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderBarNoPlus from './../../../components/header/HeaderBarNoPlus';

const LessorWarningDetailScreen = ({ navigation, route }) => {
    return (
        <View>
            <HeaderBarNoPlus title={"Quay lại"} back={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({})

export default LessorWarningDetailScreen;
