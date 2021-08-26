'use strict';

(function (angular) {
  angular.module('typeFormPluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {
        var WidgetHome = this;

        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            if (result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
              WidgetHome.data.content = {};
              else{
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                  buildfire.actionItems.execute({
                    title: "TypeForm",
                    url: WidgetHome.data.content.url,
                    action: "linkToWeb",
                    openIn: "_system",
                  },
                  (err) => {
                    if (err) return console.error(err);
                  }
                );
                }
              }
                // right here
            } else {
              WidgetHome.data = {
                content: {}
              };
              var dummyData = {url: "https://sakshityagi.typeform.com/to/OjJrqw"};
              WidgetHome.data.content.url = dummyData.url;
              
            }
          };
          WidgetHome.error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
          DataStore.get(TAG_NAMES.TYPE_FORM_DATA).then(WidgetHome.success, WidgetHome.error);
        };

        WidgetHome.onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.TYPE_FORM_DATA) {
            WidgetHome.data = event.data;
            if (WidgetHome.data && !WidgetHome.data.design)
              WidgetHome.data.design = {};
            if (WidgetHome.data && !WidgetHome.data.content)
              WidgetHome.data.content = {};
          }
        };

        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);

        WidgetHome.init();

      }])
    .filter('returnUrl', ['$sce', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      }
    }]);
})(window.angular);
