<template>
  <div class="row">
    <div class="col-sm-12 offset-sm-1 mt-4">
      <h1>All Rooms</h1>
      <div class="flex-column w-50 mb-5">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Room name"
            v-model="newRoom.name"
            @keyup.enter="addRoom"
          >
        </div>
      </div>
      <transition-group name="room-list">
        <div class="list-group" v-for="(room, index) in rooms" :key="room._id">
          <div
            class="list-group-item list-group-item-action flex-column align-items-start d-flex w-50"
          >
            <div class="justify-content-between">
              <h5 class="mb-1">{{room.name}}</h5>
              <small
                @click="removeRoom(room._id, index)"
                class="text-muted pointer"
                v-if="isLoggedIn"
              >Delete</small>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  name: "RoomPage",
  created() {
    this.$store.dispatch("getRoomList");
  },
  data() {
    return {
      newRoom: {
        name: ""
      }
    };
  },
  methods: {
    addRoom() {
      this.$store
        .dispatch("addRoom", {
          name: this.newRoom.name
        })
        .then(() => {
          this.newRoom = {
            name: ""
		  };
		  this.$store.dispatch("getRoomList");
        });
    },
    removeRoom(taskId, index) {
      this.$store.dispatch("removeRoom", {
        id,
        index
      });
    }
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState(["rooms"])
  }
};
</script>
