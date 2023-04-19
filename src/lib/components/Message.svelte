<script lang="ts">
    export let sender: string;
    export let timestamp: string;
    export let text: string;


</script>

<div class="wrapper">
    <div class="sender">{sender}:</div>
    <div class="text">{text}</div>
    <div class="time">{timestamp}</div>
</div>

<style>
    .wrapper {
        margin-bottom: 5px;
        background-color: #1a1a1a;
        border-radius: 8px;
        padding: 5px
        
    }
    
    .sender {
        color: #da2f2f;
        text-align: right;
        text-decoration-line: underline;
    }

    .text {
        color: white;
        text-align: right;
    }

    .time {
        color: #707070;
        text-align: right;
    }

</style>