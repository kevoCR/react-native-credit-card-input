import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  Platform,TouchableOpacity
} from "react-native";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";
import { Icon, CheckBox } from "react-native-elements";
import AppStyles from "../../../app/styles/AppStyles";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const BASE_SIZE = { width: 300, height: 190 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 75,
    height: 50,
    resizeMode: "contain",
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  number: {
    fontSize: 21,
    position: "absolute",
    top: 95,
    left: 28,
  },
  name: {
    fontSize: 15,
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 100,
  },
  expiryLabel: {
    fontSize: 9,
    position: "absolute",
    bottom: 40,
    left: 218,
  },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: 20,
    left: 220,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: 80,
    right: 30,
  },
  iconsettings:{
    position: "absolute",
    top: 0,
    left: 0,
    width: 75,
    height: 50,
    resizeMode: "contain",
    right:0 
  },
  defaultText:{
    position: "absolute",
    left: null,
    height: 50,
    resizeMode: "contain",
    right:50,
    top:30,
    width:110, 
    color:'white', 
    fontSize:12, 
    fontFamily:AppStyles.fontFamily.semibold },
  menuitem : {
    backgroundColor: 'transparent',
    borderColor:'transparent',
    margin:8,
    padding:0 
    }
  });

  const preset = {
    none: 'none',
    debit: 'debit',
    credit: 'credit',
    both: 'both',
  }

export default class CardView extends Component {

constructor() {
  super();
  const { preset } = this.props;
  this.state = [this.loadCheckedPreset(preset)];
}

  static propTypes = {
    focused: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,
    preset: PropTypes.oneOf(Object.keys(preset)),
    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "•••• •••• •••• ••••",
      name: "FULL NAME",
      expiry: "••/••",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("../images/card-front.png"),
    imageBack: require("../images/card-back.png"),
  };

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  loadCheckedPreset(status) {
    switch(status) {

      case preset.both: {
        this.setState({checkedReceived: true, checkedSend: true });
      }
      case preset.credit:{
        this.setState({checkedReceived: true});
      }
      case preset.debit:{
        this.setState({checkedSend: true });
      }

    }
  }

  updateState() {
    const { checkedReceived, checkedSend } = this.state;
    if (checkedReceived && checkedSend) {
      //send both
    }
    else 
    if (checkedReceived) {
       //send credit
    }
    else if (checkedSend) {
      // send debit
    }
    else {
      //send none
    }
  }

  onCheckedReceived(checkedReceived){
      this.setState({ checkedReceived: checkedReceived })
      this.updateState();
  }

  onCheckedSend() {
    this.setState({ checkedSend: !checkedSend })
    this.updateState();
  }

  render() {
    const { focused,
      brand, name, number, expiry, cvc, customIcons,
      placeholder, imageFront, imageBack, scale, fontFamily, isList, preset} = this.props;
    const { checkedReceived, checkedSend } = this.state  
    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = { transform: [
      { scale },
      { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
    ] };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}>
          <ImageBackground style={[BASE_SIZE, s.cardFace, transform]}
            source={imageFront}>
              <Image style={[s.icon]}
                source={Icons[brand]} />
                {isList && <Text style={s.defaultText}>Predeterminada</Text>}
                {isList && <TouchableOpacity onPress={this.showMenu}>
                <View style={[s.icon, { right:0 , left: null }]}>  
                <Menu
                ref={this.setMenuRef}
          button={
          <Icon containerStyle={s.iconsettings} name='settings-outline' type='material-community' color="white"/>
         }
        >
        {/* <MenuItem 
        style= { { backgroundColor: 'transparent', borderColor:'transparent', margin:0, padding:0 } }
        onPress={this.hideMenu}>Predeterminada:</MenuItem> */}
        <CheckBox
        center
        title='Recibir'
        iconType='material-community'
        checkedIcon='credit-card'
        uncheckedIcon='credit-card'
        checkedColor='blue'
        onPress={ this.onCheckedReceived(!checkedReceived, checkedSend) }
        containerStyle= { s.menuitem }
        checked={this.state.checkedReceived}/>
        <CheckBox
        center
        title='Enviar'
        iconType='material-community'
        checkedIcon='credit-card'
        uncheckedIcon='credit-card'
        checkedColor='green'
        containerStyle= { s.menuitem }
        onPress={ this.onCheckedSend }
        checked={this.state.checkedSend}/>
         <MenuDivider />
         <MenuItem 
        style= { s.menuitem }
        onPress={this.hideMenu}>Eliminar</MenuItem>
        </Menu> 
        </View>
                 </TouchableOpacity>}
              <Text style={[s.baseText, { fontFamily }, s.number, !number && s.placeholder, focused === "number" && s.focused]}>
                { !number ? placeholder.number : number }
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.name, !name && s.placeholder, focused === "name" && s.focused]}
                numberOfLines={1}>
                { !name ? placeholder.name : name.toUpperCase() }
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.expiryLabel, s.placeholder, focused === "expiry" && s.focused]}>
                MONTH/YEAR
              </Text>
              <Text style={[s.baseText, { fontFamily }, s.expiry, !expiry && s.placeholder, focused === "expiry" && s.focused]}>
                { !expiry ? placeholder.expiry : expiry }
              </Text>
              { isAmex &&
                  <Text style={[s.baseText, { fontFamily }, s.amexCVC, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                    { !cvc ? placeholder.cvc : cvc }
                  </Text> }
          </ImageBackground>
          <ImageBackground style={[BASE_SIZE, s.cardFace, transform]}
            source={imageBack}>
              <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                { !cvc ? placeholder.cvc : cvc }
              </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}
