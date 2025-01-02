import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet, ActivityIndicator} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {PermissionsAndroid, Platform} from 'react-native';

const CameraComponent = ({onClose}: any) => {
  const [device, setDevice] = useState<any>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        console.warn('Camera permission not granted');
        return;
      }
      fetchDevices();
    };

    checkPermissions();
  }, []);

  const fetchDevices = async () => {
    console.log('Fetching camera devices...');
    let availableDevices = await Camera.getAvailableCameraDevices();

    if (availableDevices.length === 0) {
      console.log('No devices found, retrying...');
      await new Promise(resolve => setTimeout(resolve, 500));
      availableDevices = await Camera.getAvailableCameraDevices();
    }

    const backCamera = availableDevices.find(
      dev =>
        dev.position === 'back' &&
        [
          'ultra-wide-angle-camera',
          'wide-angle-camera',
          'telephoto-camera',
        ].some((type: any) => dev.physicalDevices.includes(type)),
    );

    console.log('Available devices:', availableDevices);
    console.log('Selected device:', backCamera);

    setDevice(backCamera || null);
    setLoading(false);
  };

  useEffect(() => {
    const initializeCamera = async () => {
      if (device) {
        console.log('Camera device is set:', device);
        setIsCameraReady(true);
      }
    };

    initializeCamera();
  }, [device]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Button title="Fechar" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraReady && (
        <Camera style={styles.camera} device={device} isActive={true} />
      )}
      <Button title="Fechar" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});

export default CameraComponent;
