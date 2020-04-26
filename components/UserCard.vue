<template>
  <div class="user-card">
    <div class="user-details">
      <div class="user-photo">
        <img src="https://randomuser.me/api/portraits/men/15.jpg">
      </div>

      <p class="user-title">{{ userTitle }}</p>

      <p class="title-value">{{ titleValue }}</p>
    </div>

    <ul class="user-info">
      <li
        class="name active"
        @mouseover.stop="handleIconHover"></li>
      <li
        class="email"
        @mouseover.stop="handleIconHover"></li>
      <li
        class="birthday"
        @mouseover.stop="handleIconHover"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  data: function () {
    return {
      selectedInfoName: 'name',
      displayInfo: {
        name: {
          title: 'Hi, My name is',
          value: 'Steven Stevens'
        },
        email: {
          title: 'My email address is',
          value: 'steven.stevens@example.com'
        },
        birthday: {
          title: 'My birthday is',
          value: '12/6/1981'
        }
      },
    }
  },

  computed: {
    userTitle () {
      return this.displayInfo[this.selectedInfoName].title
    },

    titleValue () {
      return this.displayInfo[this.selectedInfoName].value
    }
  },

  methods: {
    handleIconHover (e) {
      const activeIcon = document.getElementsByClassName('active')
      const userInfoName = e.target.classList[0]

      if (activeIcon.length) {
        this.makeIconInactive(activeIcon[0])
      }

      this.makeIconActive(e.target)
      this.setInfoName(userInfoName)
    },

    makeIconActive (target) {
      target.classList.add('active')
    },

    makeIconInactive (target) {
      target.classList.remove('active')
    },

    setInfoName (name) {
      this.selectedInfoName = name
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
    width: 460px;
    height: 400px;
    padding: 20px 0;
    margin: 15px;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 0 1px rgba(0,0,0,.5);
    position: relative;
    z-index: 1;

    .user-details {
      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 130px;
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
        font-size: 38px;
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
</style>
