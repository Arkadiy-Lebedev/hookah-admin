<template>
    <!-- <i class="pi pi-trash icon__del" ></i> -->
    <Button icon="pi pi-trash" severity="danger"  text rounded :pt="{ 
        root: { class: 'btn-del' } 
    }" />
</template>

<style scoped>

.btn-del:hover{
  color: #EF4444 !important;
}

.btn-del{
  color: #495057 !important;
}

.btn-del:focus{
  color: #EF4444 !important;
}


</style>