# 1️⃣ Cambia a la rama develop (en caso de que estés en otra)
git checkout develop

# 2️⃣ Trae los últimos cambios desde el servidor
git pull origin develop

# 3️⃣ Verifica qué archivos has modificado
git status

# 4️⃣ Añade todos los archivos modificados para prepararlos al commit
git add .

# 5️⃣ Escribe un mensaje que describa brevemente los cambios realizados
git commit -m "Aquí va tu mensaje del commit"

# 6️⃣ Sube los cambios a la rama develop del repositorio remoto
git push origin develop
