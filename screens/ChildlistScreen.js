import React from 'react';
import * as GlobalStyles from '../GlobalStyles.js';
import * as DooCoinsAPIApi from '../apis/DooCoinsAPIApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import {
  Button,
  IconButton,
  ScreenContainer,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Fetch } from 'react-request';

const ChildlistScreen = props => {
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const { theme } = props;
  const { navigation } = props;

  const dooCoinsAPIAddChildPOST = DooCoinsAPIApi.useAddChildPOST();

  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const Verify = await DooCoinsAPIApi.getLoggedInUserGET(Constants);
        const email = Verify.email;
        if (email) {
          return;
        }
        navigation.navigate('DooCoinsScreen');
      } catch (err) {
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  const [new_child, setNew_child] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');

  return (
    <ScreenContainer
      style={StyleSheet.applyWidth(
        { backgroundColor: theme.colors['Strong'] },
        dimensions.width
      )}
      scrollable={false}
      hasSafeArea={false}
    >
      {/* Header */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 0,
            paddingTop: 40,
          },
          dimensions.width
        )}
      >
        {/* Logo */}
        <Image
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.ImageStyles(theme)['Image'], {
              height: 20,
              marginLeft: 15,
              width: 30,
            }),
            dimensions.width
          )}
          resizeMode={'cover'}
          source={Images.DooLogoWhite}
        />
        {/* Settings */}
        <IconButton
          onPress={() => {
            try {
              navigation.navigate('SettingsScreen');
            } catch (err) {
              console.error(err);
            }
          }}
          style={StyleSheet.applyWidth({ right: 20, top: 3 }, dimensions.width)}
          icon={'Ionicons/settings-sharp'}
          color={theme.colors['White']}
          size={24}
        />
      </View>
      {/* Title */}
      <View>
        <Text
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
              color: theme.colors['Strong Inverse'],
              fontFamily: 'Roboto_400Regular',
              fontSize: 26,
              marginTop: 20,
              textAlign: 'center',
            }),
            dimensions.width
          )}
        >
          {'My children'}
        </Text>
      </View>
      {/* Child list */}
      <View>
        <DooCoinsAPIApi.FetchGetChildrenGET Parent_ID={Constants['Parent_ID']}>
          {({ loading, error, data, refetchGetChildren }) => {
            const fetchData = data
            if (!fetchData || loading) {
              return <ActivityIndicator />;
            }

            if (error) {
              return (
                <Text style={{ textAlign: 'center' }}>
                  There was a problem fetching this data
                </Text>
              );
            }

            return (
              <ScrollView
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                <FlatList
                  data={fetchData}
                  listKey={'MbWtQFGu'}
                  keyExtractor={listData =>
                    listData?.id || listData?.uuid || JSON.stringify(listData)
                  }
                  renderItem={({ item }) => {
                    const listData = item;
                    console.log("items in flatLst",item)
                    return (
                      <Touchable
                        onPress={() => {
                          try {
                            setGlobalVariableValue({
                              key: 'Child_ID',
                              value: listData?.id,
                            });
                            setGlobalVariableValue({
                              key: 'Reward_ID',
                              value: listData?.rewards_id,
                            });
                            setGlobalVariableValue({
                              key: 'Child_Name',
                              value: listData?.name,
                            });
                            setGlobalVariableValue({
                              key: 'Balance',
                              value: listData?.balance,
                            });
                            navigation.navigate('BottomNav');
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 20,
                            },
                            dimensions.width
                          )}
                        >
                          {/* ChildName */}
                          <Text
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'],
                                {
                                  color: theme.colors['Light Inverse'],
                                  fontFamily: 'Roboto_400Regular',
                                  fontSize: 26,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {listData?.name}
                          </Text>
                          {/* Balance */}
                          <Text
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'],
                                {
                                  alignSelf: 'flex-start',
                                  color: theme.colors['Light Inverse'],
                                  fontFamily: 'Roboto_400Regular',
                                  fontSize: 26,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {Number(listData?.balance)}
                          </Text>
                        </View>
                      </Touchable>
                    );
                  }}
                  style={StyleSheet.applyWidth(
                    GlobalStyles.FlatListStyles(theme)['List'],
                    dimensions.width
                  )}
                  contentContainerStyle={StyleSheet.applyWidth(
                    GlobalStyles.FlatListStyles(theme)['List'],
                    dimensions.width
                  )}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                />
              </ScrollView>
            );
          }}
        </DooCoinsAPIApi.FetchGetChildrenGET>
      </View>
      {/* AddChildForm */}
      <View
        style={StyleSheet.applyWidth(
          GlobalStyles.ViewStyles(theme)['AddChildForm'],
          dimensions.width
        )}
      >
        {/* Add child */}
        <Text
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'], {
              color: theme.colors['Strong Inverse'],
              fontFamily: 'Roboto_400Regular',
              fontSize: 26,
              margin: 20,
              textAlign: 'center',
            }),
            dimensions.width
          )}
        >
          {'Add a child'}
        </Text>
        {/* child_name */}
        <TextInput
          onChangeText={newChildNameValue => {
            try {
              setNew_child(newChildNameValue);
            } catch (err) {
              console.error(err);
            }
          }}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.TextInputStyles(theme)['Text Input'],
              {
                backgroundColor: theme.colors['Medium'],
                borderColor: theme.colors['Primary'],
                borderWidth: 2,
                color: theme.colors['Light Inverse'],
                fontFamily: 'Roboto_400Regular',
                fontSize: 26,
                height: 50,
                textAlign: 'center',
                width: '80%',
              }
            ),
            dimensions.width
          )}
          value={new_child}
          placeholder={'child name'}
          autoCapitalize={'none'}
          clearTextOnFocus={true}
          textContentType={'givenName'}
          clearButtonMode={'never'}
          placeholderTextColor={theme.colors['Light']}
        />
        <Button
          onPress={() => {
            const handler = async () => {
              try {
                await dooCoinsAPIAddChildPOST.mutateAsync({
                  Parent_ID: Constants['Parent_ID'],
                  new_child: new_child,
                });
              } catch (err) {
                console.error(err);
              }
            };
            handler();
          }}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.ButtonStyles(theme)['Button'], {
              fontFamily: 'Roboto_400Regular',
              fontSize: 26,
              height: 50,
              marginTop: 20,
              width: '80%',
            }),
            dimensions.width
          )}
          title={'add child'}
        />
      </View>
    </ScreenContainer>
  );
};

export default withTheme(ChildlistScreen);
