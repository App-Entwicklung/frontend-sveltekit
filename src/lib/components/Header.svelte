<script lang="ts">
    import Icon from "@iconify/svelte";
</script>

<div>
    <a class="home" href="/">Home</a>
    <a class="github" href="https://github.com/App-Entwicklung/frontend-sveltekit/tree/polygon-chain"><Icon icon="mdi:github" width="50"/></a>
    <a class="cult" href="https://cultdao.io/"><img class="cult-logo" src="https://cultdao.io/assets/header-logo2.png" alt="link to cult website"/></a>
</div>


<style>
    div {
        font-family: Frag!important;
        font-weight: 1000!important;
        font-size: large;
        letter-spacing: 1px!important;
        align-self: center;
        margin: 1px;
        margin-top: -8px;
        padding: 2vh;
        background-color: #1a1a1a;
        border: 1px solid;
        border-radius: 8px;
        border-color: #901717;
        width: 96.7%;
        word-wrap: break-word;
        position: fixed;
        top: 0;
        display: flex;
    }

    .home {
        border-radius: 8px;
        background-color: #901717;
        padding: 7px;
        color: white;
    }

    .github {
        position: fixed;
        top: 7px;
        left: 45%;
    }

    .cult {
        margin-right: 0;
        margin-left: auto;
    }
    .cult-logo {
        margin-left: auto;
        width: 7rem;
    }
</style>