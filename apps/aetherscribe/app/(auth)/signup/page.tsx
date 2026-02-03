'use client'

import { useUser } from '@/lib/context/UserContext'
import { Form } from '@rnb/modularix'
import { I_AetherscribeSignup, I_DropdownOption } from '@rnb/types'

const formDataInit: I_AetherscribeSignup = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    renewelCycle: 'never',
    subscriptionTier: 'basic',
}

const subDetailsInit: I_DropdownOption[] = [
    {
        id: 'basic',
        label: 'Basic',
        description: 'Free account',
        value: 'basic',
    },
    {
        id: 'premium',
        label: 'Premium',
        description: 'Monthly Sub',
        value: 'premium',
    },
]

export default function SignUp() {
    const { signUp } = useUser()
    return (
        <>
            <Form<I_AetherscribeSignup>
                initialValue={formDataInit}
                buttonText="Create"
                linkText="Already have an account?"
                link={{
                    href: '/signup',
                    id: 'signup',
                    label: 'Signup',
                }}
                onSubmit={signUp}
                fields={[
                    {
                        fieldName: 'firstName',
                        id: 'firstName',
                        inputType: 'text',
                        label: 'First Name',
                        placeholder: 'Kolgart',
                    },
                    {
                        fieldName: 'lastName',
                        id: 'lastName',
                        inputType: 'text',
                        label: 'Last Name',
                        placeholder: 'Broadmaster Valenthi',
                    },
                    {
                        fieldName: 'dateOfBirth',
                        id: 'dateOfBirth',
                        inputType: 'text',
                        label: 'Date of Birth',
                        placeholder: '01/01/1990',
                    },
                    {
                        fieldName: 'nationality',
                        id: 'nationality',
                        inputType: 'text',
                        label: 'Nationality',
                        placeholder: 'Avandrian',
                    },
                    {
                        fieldName: 'email',
                        id: 'email',
                        inputType: 'email',
                        label: 'Email',
                        placeholder: 'imnotacabbage@mail.com',
                    },
                    {
                        fieldName: 'username',
                        id: 'username',
                        inputType: 'text',
                        label: 'Username',
                        placeholder: 'KolgartArgh!',
                    },
                    {
                        fieldName: 'password',
                        id: 'password',
                        inputType: 'password',
                        label: 'Password',
                        placeholder: '********',
                    },
                    {
                        fieldName: 'passwordConfirm',
                        id: 'passwordConfirm',
                        inputType: 'password',
                        label: 'Password Confirm',
                        placeholder: '*********',
                    },
                ]}
                formTitle="Create Account"
            />
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti accusamus dolorum neque quidem, sint, aliquid dicta
                commodi quas iure dolores rem. Repellat corrupti placeat
                blanditiis obcaecati, quas suscipit inventore fugiat provident
                culpa error debitis. Deleniti, numquam dicta consectetur ea
                laboriosam eos commodi quia fugit, labore consequuntur veniam
                esse unde beatae magni. Quos obcaecati vero ex libero quasi cum
                dolorem sed temporibus neque, veniam autem esse consequuntur
                eligendi voluptatem doloribus voluptatibus quidem voluptates,
                nulla exercitationem corporis modi. Similique minima delectus
                recusandae, suscipit magnam omnis tenetur porro itaque quasi
                tempore nisi nobis atque vel maiores adipisci nostrum
                consequatur corrupti veniam enim, dolor provident. Nulla iste
                eos vitae molestiae, consequuntur maxime tenetur incidunt ab
                perferendis dolore magnam quaerat beatae et est, quis facere
                quasi inventore tempora voluptatibus excepturi. Quod doloribus
                ipsa laboriosam dolorum. Consectetur quam asperiores consequatur
                beatae fugit deserunt iure deleniti eius officia iste veniam
                ipsam qui distinctio tempora, ducimus quaerat! Voluptas nihil
                dolore aspernatur laboriosam. Excepturi recusandae inventore
                veniam porro quaerat, alias at nostrum nulla placeat odio error.
                Asperiores, esse. Error quidem eligendi quis accusamus,
                molestias soluta facere repudiandae optio ullam autem
                voluptatibus deserunt officia sed quas dolor! Quasi non vitae
                ipsa reiciendis maiores magnam explicabo similique unde. Quidem
                nobis, odit fugit inventore cumque quo rerum minima incidunt
                mollitia voluptatibus maxime! Dignissimos in fugit asperiores
                nostrum perspiciatis, minima officiis voluptates dolor nulla
                assumenda, ex ducimus deserunt ipsa iusto quis corrupti sequi?
                Necessitatibus dolorum saepe reprehenderit neque mollitia
                expedita quod impedit iste earum ad quae, dicta, corporis
                repellendus enim possimus repudiandae! Reprehenderit odit animi
                repudiandae distinctio nemo ducimus, suscipit delectus
                molestiae. Perspiciatis iure voluptate eligendi. Molestiae quas
                perferendis quia obcaecati doloribus assumenda dicta soluta non
                quibusdam? Magnam cumque incidunt minus modi. Corrupti pariatur
                ipsum provident accusantium veniam obcaecati temporibus magnam
                nostrum iure doloremque aliquam doloribus, dicta corporis sit?
                Expedita id minima nesciunt ipsum perspiciatis commodi soluta!
                Praesentium necessitatibus vitae, nesciunt tempore tempora est
                sit earum ex quam maiores eum cumque, reiciendis officia quia
                animi id ea. Sint eum maiores asperiores natus nulla voluptate
                nisi dolorem officia ducimus quas repudiandae nobis,
                consequuntur, architecto quaerat. Nostrum dolorum voluptatum
                architecto fugit sapiente vitae eum veniam explicabo eos vero in
                tempore quod, consequatur recusandae saepe corrupti illo. Harum
                libero ex aut doloribus laudantium possimus nobis, reprehenderit
                tempora inventore? Nemo aliquid corrupti modi eum hic quos dicta
                deserunt voluptate autem consequatur aperiam placeat tenetur
                alias, obcaecati, repellendus provident asperiores quasi
                reiciendis totam sint odit inventore atque eveniet consequuntur.
                Possimus atque necessitatibus nostrum cumque modi unde quam sit
                at recusandae illo pariatur voluptatem optio, laboriosam nemo
                nobis, qui cum quod totam quaerat maxime aliquam sapiente
                blanditiis, dolorum distinctio? Laboriosam, eum asperiores
                explicabo atque inventore provident quod! Atque facere dicta
                dignissimos dolor beatae doloremque quae qui cupiditate quo vel.
                Quos nam esse ullam ut aut earum eos eveniet, placeat sit est
                voluptate quae impedit at quod reiciendis in delectus doloremque
                dolorum deserunt? Natus quod ullam ad deleniti doloremque fugit
                sint vitae accusantium dicta tempora, iusto nesciunt dolorem
                ducimus praesentium quia debitis modi cum, facere commodi saepe
                cumque ab. Vero!
            </p>
        </>
    )
}
