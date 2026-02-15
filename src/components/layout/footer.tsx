export function Footer() {
  return (
    <footer className="border-t bg-card py-4 mt-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} solclarus</p>
      </div>
    </footer>
  );
}
