<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
    <mine-footer></mine-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import mineFooter from '../footer/footer'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard, mineFooter },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
