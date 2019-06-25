# SyngentaShipmentLookup
Lookup delivery date with Shipment ID or PO Number
## Setup
These instructions will get a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project for release.

  1. Set up React-Native environment according to their [documentation](https://facebook.github.io/react-native/docs/getting-started.html)
  2. Clone this repository:
    `git clone  https://github.com/jyudt/SyngentaShipmentLookup.git`
  3. Install dependecies using `npm install` or `yarn`
  4. Create the file `src/environments.js` with the following contents:
```  
export default [
    {
        name: 'Preprod',
        url: 'https://preprod.gtnexus.com/rest/3.1/',
        dataKey: '[DATAKEY]',
        shipType: 'ASNType',
        accessKeyID:'[ACCESS KEY ID]',
        userID: '[DATA API USER ID]',
        SAC: '[DATA API USER SECRET KEY]',
    },
];
```
Refer to the [HMAC developer page](https://developer.infornexus.com/api/api-overview/hmac-authentication) for context.

  5. Run the project with:
`react-native start` followed by `react-native run-android` or `react-native run-ios`, or open `syngentaNative.xcodeproj` to run ios
## Notes
Remember to remove environments.js before pushing to anything public.

Problems with the image:  If it is anchored at the top outside of the text view, shorter devices will scroll the text input over it.  However, on taller devices, anchoring the image to the text input view leaves a lot of ugly space above it.  Ideas would be greatly appreciated.

If you need to push to android hardware, reference [this StackOverflow answer](https://stackoverflow.com/questions/34175416/how-to-use-offline-bundle-on-android-for-react-native-project)
