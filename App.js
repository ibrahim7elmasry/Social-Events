import * as React from 'react';
import {
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
// import  SimpleLineIcons  from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
SimpleLineIcons.loadFont();
import data from './data';
const ICON_SIZE = 42;
const ITEM_HEIGHT = ICON_SIZE * 2;
const colors = {
  yellow: '#4682B4',
  dark: 'white',
};
const { width, height } = Dimensions.get('window');

const Icon = React.memo(({ icon, color }) => {
  return <SimpleLineIcons name={icon} color={color} size={ICON_SIZE} />;
});

const Item = React.memo(({ icon, color, name, showText }) => {
  return (
    <View style={styles.itemWrapper}>
      {showText ? (
        <Text style={[styles.itemText, { color }]}>{name}</Text>
      ) : (
        // for spacing purposes
        <View />
      )}
      <Icon icon={icon} color={color} />
    </View>
  );
});

const ConnectWithText = React.memo(() => {
  return (
    <View
      style={{
        position: 'absolute',
        top: height / 2 - ITEM_HEIGHT *1.25 ,
        width: width ,
        // paddingHorizontal: 14,
        // paddingVertical: 5,
        // right:0,
        alignItems:"center"
      }}
    >
     
      <Text
        style={{
          color: colors.yellow,
          fontSize: 30,
          fontWeight: '700',
          lineHeight: 52,
        }}
      >
        اختيار المناسبة
      </Text>
    </View>
  );
});

const ConnectButton = React.memo(({ onPress }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: height / 2 + ITEM_HEIGHT / 2,
        paddingHorizontal: 14,
        right:0
      }}
    >
      <View
        style={{
          
          height: ITEM_HEIGHT * 3.5,
          width: 4,
          //  backgroundColor: colors.yellow,
        }}
      /> 
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: colors.yellow,
          alignItems: 'center',
          justifyContent: 'center',
           borderRadius: 18,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.dark }}>
           بحث
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const List = React.memo(
  React.forwardRef(
    ({ color, showText, style, onScroll, onItemIndexChange }, ref) => {
      return (
        <Animated.FlatList
          ref={ref}
          data={data}
          style={style}
          keyExtractor={(item) => `${item.name}-${item.icon}`}
          bounces={false}
          scrollEnabled={!showText}
          scrollEventThrottle={16}
          onScroll={onScroll}
          decelerationRate='fast'
          snapToInterval={ITEM_HEIGHT}
          showsVerticalScrollIndicator={false}
          renderToHardwareTextureAndroid
          contentContainerStyle={{
            paddingTop: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
            paddingBottom: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
            paddingHorizontal: 20,
          }}
          renderItem={({ item }) => {
            return <Item {...item} color={color} showText={showText} />;
          }}
          onMomentumScrollEnd={(ev) => {
            const newIndex = Math.round(
              ev.nativeEvent.contentOffset.y / ITEM_HEIGHT
            );

            if (onItemIndexChange) {
              onItemIndexChange(newIndex);
            }
          }}
        />
      );
    }
  )
);
export default function App() {
  const [index, setIndex] = React.useState(0);
  const onConnectPress = React.useCallback(() => {
    Alert.alert('Connect with:', data[index].des.toUpperCase());
  }, [index]);
  const yellowRef = React.useRef();
  const darkRef = React.useRef();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );
  const onItemIndexChange = React.useCallback(setIndex, []);
  React.useEffect(() => {
    scrollY.addListener((v) => {
      if (darkRef?.current) {
        darkRef.current.scrollToOffset({
          offset: v.value,
          animated: false,
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      {/* <StatusBar hidden /> */}
     <View style={{ position: 'absolute',
        top:  55, right:(width/2)-75}}
        >
     <Image
        style={{ 
         
          width: 150,
          height: 150,}}
        source={{
          uri: 'https://www.flaticon.com/premium-icon/icons/svg/3225/3225778.svg',
        }}
      />
       
     </View>
     
      <ConnectWithText />
   

     <List
        ref={yellowRef}
        color={colors.yellow}
        // style={StyleSheet.absoluteFillObject}
        onScroll={onScroll}
        onItemIndexChange={onItemIndexChange}
        /> 
      <List
        ref={darkRef}
        color={colors.dark}
        showText
        style={{
          position: 'absolute',
          backgroundColor: colors.yellow,
          width,
          height: ITEM_HEIGHT,
          top: height / 2 - ITEM_HEIGHT / 2,
          
        }}
        /> 
     
      <ConnectButton onPress={onConnectPress} />
      <Item />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ITEM_HEIGHT,
  },
  itemText: {
    fontSize: 26,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});