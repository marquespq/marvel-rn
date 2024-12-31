import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {Camera, getCameraDevice} from 'react-native-vision-camera';

const CameraComponent = ({onClose}: any) => {
  const devices = Camera.getAvailableCameraDevices();
  const device = getCameraDevice(devices, 'back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (device) {
      setIsCameraReady(true);
    }
  }, [device]);

  if (device == null) {
    return null;
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
