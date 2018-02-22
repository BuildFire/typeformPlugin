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
       
        var success = function (result) {
          console.info('init success result:', result);
          if (result.data && result.id) {
            ContentHome.data = result.data;
            if (!ContentHome.data.content){
                ContentHome.data.content = {
                  url: null
                };
            }
          }
          else {

            var dummyData = {
              url: null
            };

             ContentHome.data.content.url = dummyData.url;
          }

          if (ContentHome.data.content.url){
            ContentHome.TypeUrl = ContentHome.data.content.url;
          } 
          // esle here it seems that empty form was saved, ignore...
          
        };

        var error = function (err) {
          if (err && err.code !== STATUS_CODE.NOT_FOUND) {
            console.error('Error while getting data', err);
          }
          else if (err && err.code === STATUS_CODE.NOT_FOUND) {
             ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.TYPE_FORM_DATA);
          }
        };

        DataStore.get(TAG_NAMES.TYPE_FORM_DATA).then(success, error);
      };

      ContentHome.init();

      ContentHome.testUrlByPattern = function(url) {
        url = url || 'bad-url'; 
        return /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(url);
      }

      ContentHome.validateUrl = function () {
        //  var result =
        var success = function (result) {
          console.log("success:", result);
          if (result!==null) {
            ContentHome.isUrlValidated = true;
            ContentHome.data.content.url = ContentHome.TypeUrl;
            
            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.TYPE_FORM_DATA);
          }
        };

        var error = function (err) {
          ContentHome.isUrlValidated = false;
          console.log("error", err);

          $timeout(function(){ ContentHome.isUrlValidated = null; }, 3000);
        };

        if (ContentHome.testUrlByPattern(ContentHome.TypeUrl)) { 
              //test for url validity...          
            console.log("checking:>>>" + ContentHome.TypeUrl);
            Utils.validateUrl(ContentHome.TypeUrl).then(success, error);

        }
        else {

          error(new Error("Url format not valid"));

          ContentHome.isUrlValidated = false;

        
        }
      };

      ContentHome.saveData = function (newObj, tag) {
        if (typeof newObj === 'undefined' || newObj === null) {
          console.warn('Saving empty data?!');
          return;
        }

        DataStore.save(newObj, tag).then(function (result) {
          console.info('Saved data result: ', result);
          // updateMasterItem(newObj);
        },function (err) {
          console.error('Error while saving data : ', err);
        });
      };

      /*
       * Method to clear TypeForm feed url
       * */
      ContentHome.clearData = function () {
        if (!ContentHome.TypeUrl){  
          Object.apply(ContentHome.data,{content:{url: null}});
          ContentHome.saveData(ContentHome.data.content, TAG_NAMES.TYPE_FORM_DATA)
        }
      };

      ContentHome.gotToPage = function () {
        window.open('https://www.typeform.com/', '_blank');
      };

    }]);
})(window.angular, window);
