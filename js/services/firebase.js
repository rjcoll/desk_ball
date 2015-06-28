app.value('fbURL', 'https://sizzling-inferno-7254.firebaseio.com/')
.factory('Person', function (fbURL, $firebaseArray) {
  var fireRef = new Firebase(fbURL);

  return $firebaseArray(fireRef);
});
