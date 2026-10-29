export function NotFound() {
  return (
    <div className="page">
      <h1 className="h-page" tabIndex={-1}>Página não encontrada</h1>
      <div className="empty">
        <p className="lead">Este endereço não existe nesta loja.</p>
        <a href="#/produtos" className="btn btn-primary">Ver produtos</a>
      </div>
    </div>
  );
}
