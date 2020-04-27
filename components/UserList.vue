<template>
  <section class="container-fluid py-3">

    <div class="row d-flex justify-content-between">
      <div class="filters-row">
        <label class="radio-item">
          <input
            v-model="filters.gender"
            type="radio"
            value="any"
            @change.stop="applyFilters">
          <span class="filter-btn">any</span>
        </label>

        <label class="radio-item">
          <input
            v-model="filters.gender"
            type="radio"
            value="male"
            @change.stop="applyFilters">
          <span class="filter-btn">male</span>
        </label>

        <label class="radio-item">
          <input
            v-model="filters.gender"
            type="radio"
            value="female"
            @change.stop="applyFilters">
          <span class="filter-btn">female</span>
        </label>
      </div>

      <div class="pagination-row">
        <div class="pagination-btn"><b-icon-chevron-left></b-icon-chevron-left></div>
        <div class="count-input">
          <input
            v-model="pagination.results"
            :min="1"
            :max="20"
            type="number"
            id="test"
            @input.stop="validateItemsCoun">
            <b-popover :show.sync="showCounInputInfo" target="test" placement="bottom" triggers="">
        Hello <strong>World!</strong>
      </b-popover>
        </div>
        <div class="pagination-btn"><b-icon-chevron-right></b-icon-chevron-right></div>
      </div>
    </div>

    <div class="row user-list">
      <div
        class="col-12 col-md-6 col-xl-4 mb-3"
        v-for="(user, index) in userList"
        :key="index">

        <user-card
          :user-data="user"
          :card-id=index />
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BIconChevronLeft, BIconChevronRight } from 'bootstrap-vue'

import UserCard from '~/components/UserCard.vue'

export default {
  name: 'UserList',
  components: {
    UserCard,
    BIconChevronLeft,
    BIconChevronRight
  },
  data: function () {
    return {
      filters: {
        gender: 'any'
      },
      pagination: {
        page: 1,
        results: 10
      },
      showCounInputInfo: false
    }
  },

  computed: {
    ...mapGetters({
      userList: 'users/getUserList'
    })
  },

  beforeMount() {
    this.init()
  },

  methods: {
    ...mapActions({
      getUserList: 'users/GET_USER_LIST'
    }),

    applyFilters (e) {
      const { value } = e.target

      this.getUserList({
        inc: 'gender,name,email,dob,picture',
        ...this.pagination,
        ...(value !== 'any' ? { ...this.filters } : {})
      })
    },

    validateItemsCoun() {
      this.showCounInputInfo = true
      console.log('tty', this.showCounInputInfo)
    },

    async init() {
      await this.getUserList({
        inc: 'gender,name,email,dob,picture',
        ...this.pagination
      })
    }
  }
}
</script>

<style lang="scss">
.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;

  .radio-item {
    input[type="radio"] {
      display: none;

      &:checked + .filter-btn {
        color: #f9f9f9;
        background: linear-gradient(to top, #30a14c, #72e227);
      }
    }
  }

  .filter-btn {
    cursor: pointer;
    display: inline-block;
    padding: 10px;
    margin-left: 15px;
    min-height: 35px;
    min-width: 40px;
    border-radius: 3px;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
    text-transform: uppercase;

    &:hover, &:focus {
      color: #f9f9f9;
      background: linear-gradient(0deg, #d6ecd5 0%, #b9f3a8 100%);
    }
  }
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: center;

  .pagination-btn{
    display: flex;
    font-size: 25px;
    margin: 0 10px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #999;
    background: linear-gradient(to top, #30a14c, #72e227);
    color: #f9f9f9;
    text-align: center;
  }

  .count-input {
    input {
      border-radius: 5px;
      width: 70px;
    }
  }
}
</style>
