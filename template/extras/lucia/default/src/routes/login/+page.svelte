<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
</script>

<form
  method="post"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "error") {
        alert(result.error.message);
      } else if (result.type === "failure") {
        alert(result.data?.message ?? "Something went wrong");
      } else {
        goto("/");
      }
    };
  }}
>
  <fieldset>
    <label for="username">Username</label>
    <input type="text" id="username" placeholder="johndoe" name="username" />
  </fieldset>
  <fieldset>
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      placeholder="your-password"
      name="password"
    />
  </fieldset>
  <button> Sign In </button>
</form>
