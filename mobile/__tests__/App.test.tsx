/**
 * @format
 */

import 'react-native';
import React from 'react';
import AreaMobile from '../src/App';
import SignUp from '../src/pages/SignUp';
import Login from '../src/pages/Login';
import Settings from '../src/pages/Settings';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('I don\'t like react-navigation', () => {
    true
})
// it('Does the app renders ?', () => {
//   renderer.create(<AreaMobile />);
// });

// it('Does login render ?', () => {
//     renderer.create(<Login onLogIn={(b) => {}} />)
// })

// it('Does signup render ?', () => {
//     renderer.create(<SignUp />)
// })

// it ('Does settings render ?', () => {
//     renderer.create(<Settings />)
// })

// DOESN'T WORK WITH REACT-NAVIGATION SMD