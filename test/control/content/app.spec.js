describe('Unit: typeFormPluginContent content app', function () {
  describe('Unit: app', function () {
    beforeEach(module('typeFormPluginContent'));
    var location, route, rootScope;
    beforeEach(inject(function () {

    }));
    var ContentHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, Utils;

    beforeEach(inject(function (_Utils_, _$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      $rootScope = _$rootScope_;
      q = _$q_;
      scope = $rootScope.$new();
      $controller = _$controller_;
      TAG_NAMES = _TAG_NAMES_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Utils = _Utils_;
      Buildfire = {
        components: {
          carousel: {
            editor: function (name) {
              return {}
            },
            viewer: function (name) {
              return {}
            }
          }

        },     spinner: {
          hide: function () {
            return {}
          },
          show: function () {
            return {}
          }

        }
      };
        ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog'])

    }));

    beforeEach(function () {
      ContentHome = $controller('ContentHomeCtrl', {
        $scope: scope,
        $q: q,
        Buildfire: Buildfire,
        TAG_NAMES: TAG_NAMES,
        ActionItems: ActionItems,
        STATUS_CODE: STATUS_CODE,
        CONTENT_TYPE: CONTENT_TYPE,
        LAYOUTS: LAYOUTS,
        Utils:Utils
      });
    });
    describe('It will test the defined methods', function () {

      it('it should pass if ContentHome is defined', function () {
        expect(ContentHome).not.toBeUndefined();
      });
      
      it('it should pass if clearData is called', function () {
        ContentHome.clearData();
      });

      it('ContentHome.validateUrl is defined', function () {
        expect(ContentHome.validateUrl).toBeDefined();
      });

      it('ContentHome.testUrlByPattern', function () {
        expect(ContentHome.testUrlByPattern).toBeDefined();
      });
      
      it('it should validate url by pattern, covering URI formats', function() {
        expect(ContentHome.testUrlByPattern(null)).toBe(false);
        expect(ContentHome.testUrlByPattern('https://sakshityagi.typeform.com/to/OjJrqw')).toBe(true);
      });

      it('it should pass with initial state set to ContentHome instance', function () {
        
        expect(
            ContentHome.init
          ).toBeDefined();
          
          expect(ContentHome.getInitialState()).toBe(ContentHome);

      });

      it('it pass since no typed url to validate against', function () {
        
        ContentHome.init();
        expect(ContentHome.validateUrl()).toBe(false);  
        expect(ContentHome.isUrlValidated).toEqual(false);
        expect(ContentHome.TypeUrl).toBeNull();

      });

      it('it should pass with validating of a given url', function () {
        
        var url =  "https://sakshityagi.typeform.com/to/OjJrqw";
        //such url should pass validation?
        //TODO: fill in more specific tests for misspelled urls... 
        
        ContentHome.TypeUrl = url;
        expect(ContentHome.validateUrl()).toBe(true);  
        
      });

      it('it should validate against ContentHome.TypeUrl', function(){

        ContentHome.TypeUrl = null;
        expect(ContentHome.validateUrl()).toBe(false);  

        ContentHome.TypeUrl =  "https://sakshityagi.typeform.com/to/OjJrqw" ;
        expect(ContentHome.validateUrl()).toBe(true);
      });

    });

  });
});