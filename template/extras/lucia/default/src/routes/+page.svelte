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
  <a href="/api/github"><button>Connect with github</button></a>
  <a href="/login"><button>Login with username</button></a>
  <a href="/signup"><button>Create an Account</button></a>
{/if}
