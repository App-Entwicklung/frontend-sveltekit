<script lang="ts">
    import Icon from "@iconify/svelte";
</script>

<div>
    <a class="home" href="/">Home</a>
    <a class="github" href="https://github.com/App-Entwicklung/frontend-sveltekit"><Icon icon="mdi:github" width="50"/></a>
</div>


<style>
    div {
        align-self: center;
        margin: 1px;
        margin-top: -8px;
        padding: 3vh;
        background-color: #363636;
        border: 1px solid;
        border-radius: 8px;
        border-color: #646cff;
        width: 96.7%;
        word-wrap: break-word;
        position: fixed;
        top: 0;
    }

    .home {
        border-radius: 8px;
        background-color: #646cff;
        padding: 7px;
        color: #242424;
    }

    .github {
        position: fixed;
        top: 7px;
        left: 45%;
    }
</style>