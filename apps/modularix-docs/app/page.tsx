import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="app-wrapper">
            <h1>Modularix Documentation</h1>

            <p>
                Welcome to the documentation hub for the{' '}
                <strong>Modularix</strong> UI component library. This site
                provides examples, usage patterns, and explanations for shared
                components used throughout the Realms &amp; Beyond monorepo.
            </p>

            <section>
                <h2>Components</h2>
                <p>
                    Explore the core UI components available in{' '}
                    <code>@rnb/modularix</code>. Each page contains live
                    examples and notes on how to use the component across
                    different apps.
                </p>

                <ul>
                    <li>
                        <Link href="/components/dropdown">
                            Dropdown Component
                        </Link>
                        <p>
                            A flexible, recursive dropdown supporting nested
                            menus, search, custom rendering, and more. Useful
                            for actions menus, select inputs, and navigation
                            trees.
                        </p>
                    </li>

                    <li>
                        <Link href="/components/sidebar">
                            Sidebar Component
                        </Link>
                        <p>
                            A data-driven, dynamic sidebar navigation system
                            using structured link items and dropdown trees.
                            Ideal for dashboards and documentation layouts.
                        </p>
                    </li>

                    <li>
                        <Link href="/components/navbar">NavBar Component</Link>
                        <p>
                            A reusable navigation bar built on top of shared
                            navigation types. Supports simple links, dropdown
                            menus, and optional breadcrumbs.
                        </p>
                    </li>

                    <li>
                        <Link href="/components/button">Button Component</Link>
                        <p>A reusable button component.</p>
                    </li>
                </ul>
            </section>

            <section>
                <h2>About Modularix</h2>
                <p>
                    Modularix is the shared UI component layer used across the
                    Realms &amp; Beyond monorepo. Every component is:
                </p>

                <ul>
                    <li>
                        typed using the global <code>@rnb/types</code> package
                    </li>
                    <li>
                        designed to be reusable across multiple apps and
                        contexts
                    </li>
                    <li>
                        exported without styling so each app can provide its own
                        theme
                    </li>
                    <li>safe to use in both simple and advanced layouts</li>
                </ul>

                <p>
                    This documentation will grow as more components are added
                    and refined. Check back here as the library expands.
                </p>
            </section>
        </main>
    )
}
