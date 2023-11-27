<script lang="ts">
  export let data;
</script>

{#if data.session}
  Connected as {data.session.user.username}
  <br />
  <form action="/?/logout" method="post">
    <button>Logout</button>
  </form>
{:else}
  Not connected yet
  <br />
  <a href="/api/github">Connect with github</a>
  <a href="/login">Login with username</a>
  <a href="/signup">Create an Account</a>
{/if}
