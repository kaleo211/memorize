import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  PanResponder,
  Text,
} from 'react-native';
import {Card} from 'react-native-elements';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const words = ['あ', 'い', 'う', 'え', 'お'];

export default class App extends Component {
  constructor() {
    super();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
    };
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });
    this.rotateAndTranslate = {
      transform: [
        {rotate: this.rotate},
        ...this.position.getTranslateTransform(),
      ],
    };
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy});
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy},
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0});
            });
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy},
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0});
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: {x: 0, y: 0},
            friction: 4,
          }).start();
        }
      },
    });
  }

  render() {
    return (
      <View>
        <Animated.View
          {...this.PanResponder.panHandlers}
          style={[styles.animatedCard, this.rotateAndTranslate]}>
          <View style={styles.card}>
            <Text style={styles.word}>{words[0]}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animatedCard: {
    height: SCREEN_HEIGHT - 360,
    width: SCREEN_WIDTH,
    paddingHorizontal: 30,
    paddingVertical: 80,
    position: 'absolute',
  },
  card: {
    height: SCREEN_HEIGHT - 360,
    width: SCREEN_WIDTH - 60,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  word: {
    fontSize: 64,
  },
});
