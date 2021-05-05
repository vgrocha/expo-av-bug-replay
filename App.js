import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import useInterval from './useInterval'

import { Audio } from 'expo-av';
const beepFile = require('./beat.wav');
const beepAudioSound = new Audio.Sound();

export default function App() {
  const [running, setRunning] = useState(false); 
  const [tick, setTick] = useState(0);
  const [delay, setDelay] = useState("1000"); 

  useEffect(() => {
    beepAudioSound.loadAsync(beepFile);
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
    });
    return () => {
      beepAudioSound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (running)
      beepAudioSound.replayAsync();
  }, [tick, running]);

  useInterval(() => {
      setTick(tick === 0 ? 1 : 0);
    },
    running ? parseInt(delay || 1000) : null,
  )

  return (
    <View style={[styles.container, {backgroundColor: running ? tick === 0 ? '#a0f0f0' : '#9f0f1f': '#fff' }]}>
      <StatusBar style="auto" />
      <TextInput style={{marginTop: 20, marginBottom: 20}} value={delay} onChangeText={setDelay} />
      <View style={styles.section}>
        <Button title="START" onPress={() => setRunning(true)} />
      </View>
      <View  style={styles.section}>
        <Button title="PAUSE" onPress={() => setRunning(false)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  section: {
    marginVertical: 10
  }
});
