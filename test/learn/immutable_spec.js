import {expect} from 'chai';
import {List, Map, fromJS} from 'immutable';
import {transform} from 'lodash';

describe('immutability', () => {

  // ...

  describe('A List', () => {

    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    it('is immutable', () => {
      let state = List.of('Trainspotting', '28 Days Later');
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(List.of(
          'Trainspotting',
          '28 Days Later',
          'Sunshine'
      ));
      expect(state).to.equal(List.of(
          'Trainspotting',
          '28 Days Later'
      ));
    });

  });



  describe('a tree', () => {

    function addMovie(currentState, movie) {
      return currentState.set(
          'movies',
          currentState.get('movies').push(movie)
      );
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(Map({
        movies: List.of(
            'Trainspotting',
            '28 Days Later',
            'Sunshine'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
            'Trainspotting',
            '28 Days Later'
        )
      }));
    });

  });

  describe('MergeDeep Map with object', () => {

    it('is immutable', () => {


      let entityMap = Map();
      entityMap = entityMap.set('Party', {id: 'PartyId'});
      entityMap = entityMap.set('Address', {id: 'AddressId'});

      for (let item of entityMap.entries()) {
        console.log(item); // 1, 2, 3
      }

      let Party = entityMap.get('Party');
      Party.lovItems = ['bla'];
      entityMap = entityMap.set('Party', Party);

      entityMap = entityMap.merge({Feature: {id: 'FeatureId'}});

      for (let item of entityMap.entries()) {
        console.log(item); // 1, 2, 3
      }


    });

  });

  describe('Test Merge in', () => {

    it('dobre merguje', () => {

      let entityMap = Map();
      entityMap = entityMap.set('Party', {id: 'PartyId'});
      entityMap = entityMap.set('Address', {id: 'AddressId'});
      entityMap = entityMap.set('Country', {id: 'countryId'});

      let lovObject = {Party: [1,2], Address: [1,2,3]};



      entityMap = entityMap.mergeDeep(transform(lovObject, function(result, v, k) {result[k] = {lovItems: v};}));

      console.log('\n');
      for (let item of entityMap.entries()) {
        console.log(item); // 1, 2, 3
      }



    });

  });


});
