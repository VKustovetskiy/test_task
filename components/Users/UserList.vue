<template>
  <section class="container-fluid py-3">

      <div class="filters-row">
        <div
          v-for="item in radioItems"
          :key="item">
          <label class="radio-item">
            <input
              v-model="filters.gender"
              type="radio"
              :value="item"
              @change.stop="applyFilters">
            <span class="filter-btn">{{ item }}</span>
          </label>
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

    <div class="pagination-row">
        <div class="count-input">
          <span class="input-title">Users per page:</span>
          <input
            v-model.number="pagination.results"
            :min="1"
            :max="20"
            type="number"
            id="count-inp"
            @change.stop="handleUserCountInput">

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

import UserCard from '~/components/Users/UserCard.vue'

import debounce from '~/utils/debounce'

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
      radioItems: ['any', 'male', 'female'],
      isError: false,
      getUserListWrapped: debounce(this.getUserList),
      loadMoreUsersWarapped: debounce(this.loadMoreUsers),
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
      getUserList: 'users/getUserList',
      loadMoreUsers: 'users/loadMoreUsers'
    }),

    applyFilters () {
      if (!this.isError) {
        this.getUserList()
      }
    },

    handleUserCountInput (e) {
      const count = e.target.value

      this.validateItemsCount(count)

      if (!this.isError) {
        this.getUserListWithDebounce()
      }
    },

    validateItemsCount(count) {
      if (+count < 1) {
        this.displayError('ERROR_REQUIRED')
      } else if (+count > 20) {
        this.displayError('ERROR_GRETER_THEN_ALLOWED')
      } else {
        this.hideError()
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

        this.getUserListWithDebounce()
      }

    },

    goToNextPage () {
      if (!this.isError) {
        this.pagination.page++

        this.getUserListWithDebounce()
      }
    },

    loadMore () {
      if (!this.isError) {
        this.pagination.page++

        this.loadMoreUsersWithDebounce()
      }
    },

    getUserListWithDebounce () {
      this.getUserListWrapped({
        pagination: this.pagination,
        filters: this.filters
      })
    },

    loadMoreUsersWithDebounce () {
      this.loadMoreUsersWarapped({
        pagination: this.pagination,
        filters: this.filters
      })
    },

    async init() {
      await this.getUserList({
        pagination: this.pagination
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

@media screen  and (max-width: 540px) {
  .pagination-btn-title {
    display: none;
  }
}
</style>
