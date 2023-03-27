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
        background-color: #242424;
        border-radius: 8px;
        padding: 5px
        
    }
    
    .sender {
        color: #646cff;
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