import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Button, Menu } from 'react-native-paper';

import { useCamera } from '../../hooks/useCamera/useCamera';
import { useDeviceLibrary } from '../../hooks/useDeviceLibrary/useDeviceLibrary';
import { DeviceMedia } from '../../interfaces/media';
import { StackNavigationProp } from '../../interfaces/navigators';

export const MenuAddMedia = ({
  contentType,
  empty,
  fieldKey,
  initialRoute,
  single = false,
}: {
  contentType: string;
  empty: boolean;
  fieldKey: string;
  initialRoute: string;
  single: boolean;
}) => {
  const navigation = useNavigation<StackNavigationProp>();
  const [visible, setVisible] = useState(false);
  const { launch: launchCamera } = useCamera();
  const { launch: launchLibrary } = useDeviceLibrary();

  const close = useCallback(() => setVisible(false), []);
  const open = useCallback(() => setVisible(true), []);

  const handleCameraPress = useCallback(() => {
    launchCamera((image: DeviceMedia) => {
      navigation.navigate('EditMedia', {
        initialRoute,
        image,
        key: fieldKey,
        single,
      });
    });

    close();
  }, [close, fieldKey, initialRoute, launchCamera, navigation, single]);

  const handleMediaLibraryPress = useCallback(() => {
    launchLibrary((image: DeviceMedia) => {
      navigation.navigate('EditMedia', {
        initialRoute,
        image,
        key: fieldKey,
        single,
      });
    });

    close();
  }, [close, fieldKey, initialRoute, launchLibrary, navigation, single]);

  const handleCHonePress = useCallback(() => {
    navigation.navigate('AddCH1Media', {
      contentType,
      key: fieldKey,
      initialRoute,
      single,
    });

    close();
  }, [close, contentType, fieldKey, initialRoute, navigation, single]);

  const buttonLabel = useMemo(() => {
    const add = 'Add';
    const replace = 'Replace';

    if (empty) {
      return add;
    }

    return single ? replace : add;
  }, [empty, single]);

  return (
    <Menu
      visible={visible}
      onDismiss={close}
      anchor={
        <Button icon="plus" mode="contained" onPress={open}>
          {buttonLabel}
        </Button>
      }
    >
      <Menu.Item leadingIcon="camera" onPress={handleCameraPress} title="Camera" />
      <Menu.Item leadingIcon="folder" onPress={handleMediaLibraryPress} title="Device" />
      <Menu.Item leadingIcon="apps" onPress={handleCHonePress} title="CH ONE" />
    </Menu>
  );
};
