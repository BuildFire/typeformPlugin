
"use strict";

(function(angular, window) {

  angular
    .module("typeFormPluginContent", ["ui.bootstrap"])
    .controller("ContentHomeCtrl", 
    [
      "Utils",
      "DataStore",
      "TAG_NAMES",
      "STATUS_CODE",
      "$timeout",
    
      function(Utils, DataStore, TAG_NAMES, STATUS_CODE, $timeout) {
        
        var ContentHome = this;
        
        ContentHome.getInitialState = function() {
          
          var contentHome = ContentHome; 
          contentHome.isUrlValidated = null;
          contentHome.TypeUrl = null;

          var url =  { url: null };
          var content = { content: { url: url }};
          contentHome.data = {content: content };
           
          return contentHome;
        };
    

      
        /*Init method call, it will bring all the pre saved data*/
        ContentHome.init = function init() {
          
          var home = ContentHome.getInitialState();

          var success = function(result) {
            console.info("init success result:", result);
            if (result && result.data && result.id) {
              home.data = result.data;
              if (!home.data.content){
                  home.data = getInitialState();
              }
            } 
            else {
              home.data.content.url = null;
            }

            if (home.data.content.url) {
              home.TypeUrl = home.data.content.url;
            }
            // esle here it seems that empty form was saved, ignore...
          };

          var error = function(err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error("Error while getting data", err);
            } else if (err && err.code === STATUS_CODE.NOT_FOUND) {
              ContentHome.saveData(
                JSON.parse(angular.toJson(home.data)),
                TAG_NAMES.TYPE_FORM_DATA
              );
            }
          };

          //get page content data by url 
          DataStore.get(TAG_NAMES.TYPE_FORM_DATA).then(success, error);
        }

        /** ?! it's auto initialized here...? */
        ContentHome.init();
     
        ContentHome.testUrlByPattern = function(url) {
          url = url || "bad-url";
          return /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(
            url
          );
        };

        /*
          sideeffect -  successfully validated last urls are saved... 
        */
        ContentHome.validateUrl = function() {
          var success = function(result) {
            console.log("success:", result);
            if (result !== null) {
              ContentHome.isUrlValidated = true;
              ContentHome.data.content.url = ContentHome.TypeUrl;

              ContentHome.saveData(
                JSON.parse(angular.toJson(ContentHome.data)),
                TAG_NAMES.TYPE_FORM_DATA
              );
            }
          };
          var error = function(err) {
            ContentHome.isUrlValidated = false;
            console.log("error", err);

            $timeout(function() {
              ContentHome.isUrlValidated = null;
            }, 3000);
          };
          
          if (ContentHome.testUrlByPattern(ContentHome.TypeUrl)) {
            //test for url validity...
            console.log("url:" + ContentHome.TypeUrl);
            Utils.validateUrl(ContentHome.TypeUrl).then(success, error);
            
            return true;

          } else {
            error(new Error("Url format not valid"));
            ContentHome.isUrlValidated = false;
            
            return false;
          }

          return ContentHome.isUrlValidated;
        };

        ContentHome.saveData = function(newObj, tag) {
          if (typeof newObj === "undefined" || newObj === null) {
            console.warn("Saving empty data?!");
            return;
          }

          DataStore.save(newObj, tag).then(
            function(result) {
              console.info("Saved data result: ", result);
              // updateMasterItem(newObj);
            },
            function(err) {
              console.error("Error while saving data : ", err);
            }
          );
        };

        /*
       * Method to clear TypeForm feed url
       * */
      ContentHome.clearData = function () {
        if (!ContentHome.TypeUrl){  
          ContentHome = ContentHome.getInitialState();
          ContentHome.saveData(ContentHome.data.content, TAG_NAMES.TYPE_FORM_DATA)
        }
      };

        ContentHome.gotToPage = function() {
          window.open("https://www.typeform.com/", "_blank");
        };
      }
    ]);
})(window.angular, window);
