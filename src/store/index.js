import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import { constants } from '../config/constants'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem(constants.LOCALSTORAGE_TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(constants.LOCALSTORAGE_USER_KEY) || '{}'),
    tasks: [],
    rooms: [],
  },
  mutations: {
    authenticate(state, payload) {
      state.token = payload.token;
      state.user = payload.user;

      localStorage.setItem(constants.LOCALSTORAGE_TOKEN_KEY, payload.token);
      localStorage.setItem(constants.LOCALSTORAGE_USER_KEY, JSON.stringify(payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = {};

      localStorage.setItem(constants.LOCALSTORAGE_TOKEN_KEY, '');
      localStorage.setItem(constants.LOCALSTORAGE_USER_KEY, '');
    },
    set_rooms(state, rooms) {
      state.rooms = rooms;
    },
    add_room(state, room) {
      state.rooms.unshift(room);
    },
    remove_room(state, rooms) {
      state.rooms.splice(index, 1);
    }
  },
  actions: {
    async register(context, payload) {
      try {
        const registerResponse = await axios.post('/api/register', payload);

        return Promise.resolve(_.get(registerResponse, 'data.message'));

      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async login(context, payload) {
      try {
        const loginResponse = await axios.post('/api/login', payload);
        const { token, user } = loginResponse.data;

        context.commit('authenticate', { token, user });

        return Promise.resolve();
      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async logout(context) {
      try {
        context.commit('logout');

        return Promise.resolve();
      } catch (error) {
        return Promise.reject(_.get(error.response, 'data.message'));
      }
    },
    async getRoomList({ commit }) {
      axios.get('/api/rooms')
        .then((response) => {
          commit('set_rooms', response.data);
        });
    },
    async addRoom({ commit }, newRoom) {
      axios.post('/api/rooms', newRoom)
        .then((response) => {
          commit('add_room', _.get(response.data, 'room'));
        });
    },
    async removeRoom({ commit }, { id, index }) {
      axios.delete(`/api/rooms/${id}`)
        .then(() => {
          commit('remove_room', index);
        });
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  },
});
