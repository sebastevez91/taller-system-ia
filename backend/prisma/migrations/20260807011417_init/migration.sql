-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'MECANICO', 'DUENIO');

-- CreateEnum
CREATE TYPE "TipoMantenimiento" AS ENUM ('PREVENTIVO', 'CORRECTIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "patente" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "kmActual" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Componente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "vidaUtilKm" INTEGER NOT NULL,
    "vidaUtilMeses" INTEGER NOT NULL,

    CONSTRAINT "Componente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehiculoComponente" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "fechaInstalacion" TIMESTAMP(3) NOT NULL,
    "kmInstalacion" INTEGER NOT NULL,

    CONSTRAINT "VehiculoComponente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mantenimiento" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "kmAlMomento" INTEGER NOT NULL,
    "tipo" "TipoMantenimiento" NOT NULL,
    "descripcion" TEXT,
    "costo" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Mantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediccion" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "componenteId" TEXT NOT NULL,
    "scoreRiesgo" DECIMAL(5,4) NOT NULL,
    "fechaGenerada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recomendacion" TEXT NOT NULL,

    CONSTRAINT "Prediccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_patente_key" ON "Vehiculo"("patente");

-- CreateIndex
CREATE UNIQUE INDEX "Componente_nombre_key" ON "Componente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "VehiculoComponente_vehiculoId_componenteId_key" ON "VehiculoComponente"("vehiculoId", "componenteId");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiculoComponente" ADD CONSTRAINT "VehiculoComponente_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiculoComponente" ADD CONSTRAINT "VehiculoComponente_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediccion" ADD CONSTRAINT "Prediccion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediccion" ADD CONSTRAINT "Prediccion_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
