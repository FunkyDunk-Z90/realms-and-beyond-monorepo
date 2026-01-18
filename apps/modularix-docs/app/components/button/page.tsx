'use client'

import { Button } from '@rnb/modularix'

export default function ButtonDocsPage() {
    const handleClick = () => {
        console.log('click')
    }
    return (
        <div>
            <div>
                <h1>Button Styles</h1>
                <ul>
                    <li>
                        <p>Primary</p>
                        <Button children="Button" handleClick={handleClick} />
                    </li>
                    <li>
                        <p>Accent</p>
                        <Button
                            children="Button"
                            theme="accent"
                            handleClick={handleClick}
                        />
                    </li>
                    <li>
                        <p>Warning</p>
                        <Button
                            children="Button"
                            theme="warning"
                            handleClick={handleClick}
                        />
                    </li>
                    <li>
                        <p>Confirm</p>
                        <Button
                            children="Button"
                            theme="success"
                            handleClick={handleClick}
                        />
                    </li>
                    <li>
                        <p>Submit</p>
                        <Button
                            children="Button"
                            theme="submit"
                            handleClick={handleClick}
                        />
                    </li>
                    <li>
                        <p>Danger</p>
                        <Button
                            children="Button"
                            theme="danger"
                            handleClick={handleClick}
                        />
                    </li>
                    <li>
                        <p>Disabled</p>
                        <Button
                            children="Button"
                            theme="disabled"
                            handleClick={handleClick}
                            isDisabled={true}
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}
