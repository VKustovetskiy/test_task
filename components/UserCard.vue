<template>
  <div
    :id="`card-${cardId}`"
    class="user-card"
    @click.stop="$bvModal.show(`userModal${cardId}`)">
    <div class="user-details">
      <div class="user-photo">
        <img :src="getUserPhotoUrl">
      </div>

      <p class="user-title">{{ userTitle }}</p>

      <p class="title-value">{{ getTitleValue(selectedInfoName) }}</p>
    </div>

    <ul class="user-info">
      <li
        data-title="Hi, My name is"
        class="name active"
        @mouseover.stop="handleIconHover"></li>
      <li
        data-title="My email address is"
        class="email"
        @mouseover.stop="handleIconHover"></li>
      <li
        data-title="My birthday is"
        class="birthday"
        @mouseover.stop="handleIconHover"></li>
    </ul>

    <div class="col-3">
      <b-modal
        :id="`userModal${this.cardId}`"
        centered
        ok-only
        class="card-modal">
        <p>My email is <span class="font-weight-bold text-success">{{ userData.email }}</span>.
        Gender is <span class="font-weight-bold text-success">{{ userData.gender }}</span>.
        Age is <span class="font-weight-bold text-success">{{ userData.dob.age }}</span></p>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    userData: {
      type: Object,
      default: () => ({
        gender: "female",
        name: {first: "John", last: "Doe"},
        email: "john.doe@example.com",
        dob: {date: "1956-08-15T02:12:48.206Z", age: 64},
        picture: {large: "https://randomuser.me/api/portraits/women/93.jpg"}
      })
    },
    cardId: {
      type: Number | String ,
      default: 1
    }
  },
  data: function () {
    return {
      selectedInfoName: 'name',
      userTitle: 'Hi, My name is'
    }
  },

  computed: {
    getUserPhotoUrl() {
      return this.userData.picture.large
    }
  },

  methods: {
    handleIconHover (e) {
      const activeIcon = this.getParentCardNode(this.cardId).getElementsByClassName('active')
      const userInfoName = e.target.classList[0]
      const userTitle = e.target.getAttribute('data-title')

      if (activeIcon.length) {
        this.makeIconInactive(activeIcon[0])
      }

      this.makeIconActive(e.target)
      this.setInfoName(userInfoName)
      this.setUserTitle(userTitle)
    },

    makeIconActive (target) {
      target.classList.add('active')
    },

    makeIconInactive (target) {
      target.classList.remove('active')
    },

    setInfoName (name) {
      this.selectedInfoName = name
    },

    setUserTitle (title) {
      this.userTitle = title
    },

    getTitleValue (propName) {
      switch (propName) {
        case 'name':
          return `${this.userData.name.first} ${this.userData.name.last}`
        case 'email':
          return this.userData.email
        case 'birthday':
          return this.$options.filters.formatDate(this.userData.dob.date)
      }
      return this.userData[this.selectedInfoName]
    },

    getParentCardNode (cardId) {
      return document.getElementById(`card-${cardId}`)
    }
  }
}
</script>

<style lang="scss">
  .user-card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 240px;
    padding: 20px 0;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 0 1px rgba(0,0,0,.5);
    position: relative;
    text-align: center;
    z-index: 1;

    .user-details {
      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        min-height: 130px;
        top: 0;
        right: 0;
        background: #f9f9f9;
        border-bottom: 1px solid rgba(0,0,0,.15);
        z-index: -1;
      }

      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .user-photo {
        width: 150px;
        height: 150px;
        margin-bottom: 30px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid rgba(0,0,0,.25);
        position: relative;
        left: 50%;
        transform: translateX(-50%);

        img {
          border-radius: 50%;
          width: 148px;
          padding: 5px;;
        }
      }

      .user-title {
        color: #999;
        font-size: 18px;
        margin: 10px;
      }

      .title-value {
        color: #2c2e31;
        font-size: 28px;
        margin: 10px;
      }
    }

    .user-info {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      li {
        cursor: pointer;
        display: block;
        width: 40px;
        height: 48px;
        float: left;
        margin: 20px;
        background-image: url(~assets/img/card_icons.png);
        background-size: 378px;
        background-position-y: -48px;
        transition: all .25s ease-out;
      }

      .name {
        background-position: 0 -48px;

        &.active {
          background-position: 0 -96px;
        }
      }

      .email {
        background-position: -68px -48px;

        &.active {
          background-position: -68px -96px;
        }
      }

      .birthday {
        background-position: -135px -48px;

        &.active {
          background-position: -135px -96px;
        }
      }
    }

  }
      .card-modal span {
        font-weight: 600;
      }
</style>
