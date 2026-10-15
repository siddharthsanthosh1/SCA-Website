import { Component } from "react";

/* Catches anything that throws while a page renders — most often a lazy
   chunk that won't load because the site was redeployed while this tab was
   open, or the school wifi dropped. Without it React unmounts everything and
   the student sees a blank white page. Progress is already saved, so a reload
   loses nothing. `resetKey` (the URL) clears the error on navigation. */
export default class ErrorBoundary extends Component {
  state = { error: null, key: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error) {
    console.error("[SCA Learn] page failed to render", error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="shell" style={{ paddingBlock: 60, maxWidth: 560 }}>
        <div className="card stack" style={{ gap: 12 }} role="alert">
          <h1 className="h2">This page didn't load</h1>
          <p className="muted">
            The internet may have dropped for a moment, or the site was just updated. Your progress is
            saved — reloading fixes it.
          </p>
          <div className="row">
            <button className="btn" onClick={() => window.location.reload()}>Reload the page</button>
          </div>
        </div>
      </main>
    );
  }
}
