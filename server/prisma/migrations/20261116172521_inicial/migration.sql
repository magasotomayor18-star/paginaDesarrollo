BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Producto] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(100) NOT NULL,
    [descripcion] NVARCHAR(1000) NOT NULL,
    [precio] DECIMAL(10,2) NOT NULL,
    [stock] INT NOT NULL CONSTRAINT [Producto_stock_df] DEFAULT 0,
    [categoria] NVARCHAR(50) NOT NULL,
    [imagen] NVARCHAR(1000) NOT NULL,
    [etiqueta] NVARCHAR(50),
    [activo] BIT NOT NULL CONSTRAINT [Producto_activo_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Producto_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Producto_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(254) NOT NULL,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [role] NVARCHAR(10) NOT NULL CONSTRAINT [Usuario_role_df] DEFAULT 'user',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuario_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Pedido] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [total] DECIMAL(12,2) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Pedido_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Pedido_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PedidoDetalle] (
    [id] INT NOT NULL IDENTITY(1,1),
    [pedidoId] INT NOT NULL,
    [productoId] INT NOT NULL,
    [cantidad] INT NOT NULL,
    [precioUnitario] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [PedidoDetalle_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PedidoDetalle_pedidoId_productoId_key] UNIQUE NONCLUSTERED ([pedidoId],[productoId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Pedido] ADD CONSTRAINT [Pedido_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PedidoDetalle] ADD CONSTRAINT [PedidoDetalle_pedidoId_fkey] FOREIGN KEY ([pedidoId]) REFERENCES [dbo].[Pedido]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PedidoDetalle] ADD CONSTRAINT [PedidoDetalle_productoId_fkey] FOREIGN KEY ([productoId]) REFERENCES [dbo].[Producto]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
