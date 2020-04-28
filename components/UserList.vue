<template>
  <section class="container-fluid py-3">

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

    <div class="pagination-row">
        <div class="count-input">
          <span class="input-title">Users per page:</span>
          <input
            v-model.number="pagination.results"
            :min="1"
            :max="20"
            type="number"
            id="count-inp"
            @input.stop="handleUserCountInput">

            <b-popover
              :show.sync="isError"
              target="count-inp"
              placement="bottom"
              triggers=""
              variant="danger">
              {{ errorMessage }}
            </b-popover>
        </div>

      <button
        :class="pagination.page <= 1 ? 'disabled' : ''"
        class="pagination-btn"
        @click.stop="goToPrevPage">
        <b-icon-chevron-left></b-icon-chevron-left><span class="pagination-btn-title">prev</span>
      </button>

      <button
        class="pagination-btn"
        @click.stop="loadMore">
        <span class="pagination-btn-title">more</span><b-icon-arrow-repeat></b-icon-arrow-repeat>
      </button>

      <button
        class="pagination-btn"
        @click.stop="goToNextPage">
        <span class="pagination-btn-title">next</span><b-icon-chevron-right></b-icon-chevron-right>
      </button>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BIconChevronLeft, BIconChevronRight, BIconArrowRepeat } from 'bootstrap-vue'

import UserCard from '~/components/UserCard.vue'

import debounce from '../utils/debounce'

export default {
  name: 'UserList',
  components: {
    UserCard,
    BIconChevronLeft,
    BIconChevronRight,
    BIconArrowRepeat
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
      isError: false,
      getUserListWithDebounce: debounce(this.getUserList),
      loadMoreUsersWithDebounce: debounce(this.loadMoreUsers),
      errorMessage: 'Required'
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
      getUserList: 'users/GET_USER_LIST',
      loadMoreUsers: 'users/LOAD_MORE_USERS'
    }),

    applyFilters (e) {
      const { value } = e.target

      this.getUserList({
        inc: 'gender,name,email,dob,picture',
        ...this.pagination,
        ...(value !== 'any' ? { ...this.filters } : {})
      })
    },

    async handleUserCountInput (e) {
      const count = e.target.value
      const { valid, msg } = await this.validateItemsCount(count)

      if (valid) {
        this.hideError()
        this.getUserListWithDebounce({
          inc: 'gender,name,email,dob,picture',
          ...this.pagination,
          ...(this.filters.gender !== 'any' ? { ...this.filters } : {})
        })
      } else {
        this.displayError(msg)
      }
    },

    validateItemsCount(count) {
      if (+count < 1) {
        return { valid: false, msg: 'ERROR_REQUIRED' }
      } else if (+count > 20) {
        return { valid: false, msg: 'ERROR_GRETER_THEN_ALLOWED' }
      } else {
        return { valid: true, msg: 'VALID'}
      }
    },

    displayError (errKey) {
      switch (errKey) {
        case 'ERROR_REQUIRED':
          this.errorMessage = 'Required'
          this.isError = true
          break
        case 'ERROR_GRETER_THEN_ALLOWED':
          this.errorMessage = 'Value should be not greater then 20'
          this.isError = true
          break
        default:
          this.isError = false
      }
    },

    hideError () {
      this.isError = false
    },

    goToPrevPage () {
      if (this.pagination.page >= 2 && !this.isError) {
        this.pagination.page = this.pagination.page - 1

        this.getUserListWithDebounce({
          inc: 'gender,name,email,dob,picture',
          ...this.pagination,
          ...(this.filters.gender !== 'any' ? { ...this.filters } : {})
        })
      }

    },

    goToNextPage () {
      if (!this.isError) {
        this.pagination.page++

        this.getUserListWithDebounce({
          inc: 'gender,name,email,dob,picture',
          ...this.pagination,
          ...(this.filters.gender !== 'any' ? { ...this.filters } : {})
        })
      }
    },

    loadMore () {
      // const { valid } = this.validateItemsCount(this.pagination.results)
      // const availableItemsToLoad = 20 - this.pagination.results

      // if (valid && availableItemsToLoad) {
      //   this.pagination.results = availableItemsToLoad > 5 ? this.pagination.results + 5 : 20

      //   this.getUserListWithDebounce({
      //     inc: 'gender,name,email,dob,picture',
      //     ...this.pagination,
      //     ...(this.filters.gender !== 'any' ? { ...this.filters } : {})
      //   })
      // }
      if (!this.isError) {
        this.pagination.page++

        this.loadMoreUsersWithDebounce({
          inc: 'gender,name,email,dob,picture',
          ...this.pagination,
          ...(this.filters.gender !== 'any' ? { ...this.filters } : {})
        })
      }
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
    margin-right: 15px;
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
  border-top: 2px solid rgb(197, 194, 194);
  padding-top: 15px;

  .pagination-btn {
    display: flex;
    font-size: 25px;
    margin: 0 10px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #f9f9f9;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    color: #999;

    &:hover:not(.disabled) {
      color: #f9f9f9;
      background: linear-gradient(0deg, #e7e7e7 0%, #cccccc 100%);
    }

    &:focus {
      outline: none;
    }

    &.disabled {
      background-color: #e2e1e1;
      border-color: #e2e1e1;
    }
  }

  .input-title {
    color: #999;
    margin-right: 10px;
  }

  .count-input {
    input {
      border-radius: 5px;
      width: 70px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  .pagination-btn-title {
    font-size: 18px;
    text-transform: capitalize;
    margin: 0 5px;
  }
}
</style>
