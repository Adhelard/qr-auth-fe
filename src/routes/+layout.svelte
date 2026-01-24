<script lang="ts">
    // Pastikan path-nya benar!
    // Jika layout ada di src/routes/, dan css ada di src/app.css
    // Maka gunakan ../app.css
    import '../app.css'; 

    let { children } = $props();
</script>

{@render children()}