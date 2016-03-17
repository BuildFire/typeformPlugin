'use strict';

(function (angular, window) {
  angular.module('typeFormPluginContent', ['ui.bootstrap'])
    .controller('ContentHomeCtrl', ['Utils', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', '$timeout', function (Utils, DataStore, TAG_NAMES, STATUS_CODE, $timeout) {
      var ContentHome = this;
      ContentHome.data = {
        content: {
          url: null
        }
      };
      ContentHome.isUrlValidated = null;
      ContentHome.TypeUrl = null;
      /*Init method call, it will bring all the pre saved data*/
      ContentHome.init = function () {
        ContentHome.success = function (result) {
          console.info('init success result:>>>>>>>>>>>>>>>>>>', result);
          if (result.data && result.id) {
            ContentHome.data = result.data;
            if (!ContentHome.data.content)
              ContentHome.data.content = {};
            ContentHome.TypeUrl = ContentHome.data.content.url;
          }
          else {
            var dummyData = {url: "https://sakshityagi.typeform.com/to/OjJrqw"};
            ContentHome.TypeUrl = ContentHome.data.content.url = dummyData.url;
          }
        };
        ContentHome.error = function (err) {
          if (err && err.code !== STATUS_CODE.NOT_FOUND) {
            console.error('Error while getting data', err);
          }
          else if (err && err.code === STATUS_CODE.NOT_FOUND) {
            // ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.TYPE_FORM_DATA);
          }
        };
        DataStore.get(TAG_NAMES.TYPE_FORM_DATA).then(ContentHome.success, ContentHome.error);
      };
      ContentHome.init();


      ContentHome.validateUrl = function () {
        //  var result =
        ContentHome.success = function (result) {
          console.log("?????????", result);
          if (result) {
            ContentHome.isUrlValidated = true;
            ContentHome.data.content.url = ContentHome.TypeUrl;
            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.TYPE_FORM_DATA);
          }
        };
        ContentHome.error = function (err) {
          ContentHome.isUrlValidated = false;
          console.log("?????????error", err)
        };
        $timeout(function () {
          ContentHome.isUrlValidated = null;
        }, 3000);

        if ((/typeform.com/).test(ContentHome.TypeUrl)) {
          Utils.validateUrl(ContentHome.TypeUrl).then(ContentHome.success, ContentHome.error);
        }
        else {
          ContentHome.error(new Error("Url format not valid"));
        }
      };

      ContentHome.saveData = function (newObj, tag) {
        if (typeof newObj === 'undefined') {
          return;
        }
        ContentHome.success = function (result) {
          console.info('Saved data result: ', result);
          // updateMasterItem(newObj);
        };
        ContentHome.error = function (err) {
          console.error('Error while saving data : ', err);
        };
        DataStore.save(newObj, tag).then(ContentHome.success, ContentHome.error);
      };

      /*
       * Method to clear TypeForm feed url
       * */
      ContentHome.clearData = function () {
        if (!ContentHome.TypeUrl) {
          ContentHome.data.content.url = null;
          ContentHome.saveData(ContentHome.data.content, TAG_NAMES.TYPE_FORM_DATA)
        }
      };

      ContentHome.gotToPage = function () {
        window.open('https://www.typeform.com/', '_blank');
      };

    }]);
})(window.angular, window);
