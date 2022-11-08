



import { Button, Input, message } from 'antd';
import React, { useState } from 'react'
import { graphql } from '../../../api';
import { FetchEzyVet } from '../../../utils/FetchEzyvet';
import MyModal from '../../../utils/myModal/MyModal';
import { px } from '../../../utils/px';

const Integration = () => {
    const [switchType, setSwitchType] = useState('vetspire');//选择是哪种集成
    const [vetspireValue, setVetspireValue] = useState('SFMyNTY.g3QAAAACZAAEZGF0YW0AAAAIMTIxOjUxNDdkAAZzaWduZWRuBgA2HeSibwE.FSigojcmpREK5InTRp1iaxg_S2QQnz_Vd5_Z_PIlRQc');   //vetspire的key值
    const [client_id, setClient_id] = useState('085b019370a8a0e2100716b85c76f136');          //ezyvet的client_id值
    const [client_secret, setClient_secret] = useState("$2y$10$HIzXoSyDxaLt05Qf6Lwp.OPBHtH79Mnz5/I1oQBOxqMDT3kOxdg0C")     //ezyvet的client_secret
    const [partner_id, setPartner_id] = useState('d10d461ada1a8a22a130e14f020fbe9f35b455fa8e1b1476ce51e3a8ae6a2b0e')           //ezyvet的partner_id
    const [loading, setLoading] = useState(false)

    const ezyvetTest = () => {
        if (!client_id || !client_secret || !partner_id) {
            let title = !client_id ?
                ' client_id' :
                !client_secret ? "client_secret" : 'partner_id'
            message.error(`Please enter ${title} to continue`);
            return
        }
        let params = {
            client_id,
            client_secret,
            partner_id,
            grant_type: "client_credentials",
            scope: "read-address,read-animal,read-animalcolour,read-appointment,read-appointmentstatus,read-appointmenttype,read-assessment,read-attachment,read-batch,read-billingcredit,read-breed,read-communication,read-consult,read-contact,read-contactassociation,read-contactdetail,read-contactdetailtype,read-country,read-diagnostic,read-diagnosticrequest,read-diagnosticresult,read-diagnosticresultitem,read-healthstatus,read-history,read-integrateddiagnostic,read-invoice,read-invoiceline,read-jobqueue,read-operation,read-payment,read-paymentallocation,read-paymentmethod,read-physicalexam,read-plan,read-prescription,read-prescriptionitem,read-presentingproblem,read-presentingproblemlink,read-priceadjustment,read-product,read-productgroup,read-productminimumstock,read-productpricing,read-productsupplier,read-purchaseorder,read-purchaseorderitem,read-receiveinvoice,read-receiveinvoiceitem,read-resource,read-separation,read-sex,read-species,read-stocktransaction,read-systemsetting,read-tag,read-tagcategory,read-tagname,read-therapeutic,read-user,read-vaccination,read-webhookevents,read-webhooks,read-wellnessplan,read-wellnessplanbenefit,read-wellnessplanbenefititem,read-wellnessplanmembership,read-wellnessplanmembershipoption,read-wellnessplanmembershipstatusperiod,write-appointment,write-attachment,write-consult,write-contact,write-healthstatus,write-invoice,write-invoiceline,write-payment,write-stockadjustment,write-stockadjustmentitem,write-webhooks"
        }
        console.log('入参', params);
        setLoading(true)

        FetchEzyVet('/oauth/access_token', 'POST', params)
            .then(res => {
                console.log(res);
                setLoading(false)
                // message.success('拿到数据')
                let { messages, meta } = res
                if (meta && meta.transaction_id) {
                    message.success('Verification passed')
                } else {
                    if (messages[0].type === "InvalidRequestException") {
                        message.error("Input error, please re-enter")
                    }
                }

            })
            .catch(err => {
                setLoading(false)
                message.error('system error')
                console.log(err);
            })

    }
    const vetspireTest = () => {
        if (!vetspireValue) {
            message.error(`Please enter key to continue`);
            return
        }
        let params = {
            query: `query{
                org { 
                    id, 
                    name
                }
            }`
        }
        setLoading(true)

        graphql(params, vetspireValue)
            .then(res => {
                setLoading(false)
                console.log(res);

                if (res.data && res.data.org) {
                    message.success('Verification passed')
                } else {
                    message.error('Input error, please re-enter')
                }
            })
            .catch(err => {
                setLoading(false)
                // console.log(err.error);
                if (`${err}`.indexOf('Request failed with status code 401') !== -1) {
                    message.error('Input error, please re-enter')
                } else {
                    message.error('system error')
                }
            })
    }
    const test = () => {
        message.destroy()
        if (switchType === 'vetspire') {
            vetspireTest()
        } else {
            ezyvetTest()
        }
    }


    //选择集成
    const onSwitchIntegration = (type) => {
        setSwitchType(type)
    }
    const changeClientId = (e) => setClient_id(e.target.value)
    const changeClientSecret = (e) => setClient_secret(e.target.value)
    const changePartnerId = (e) => setPartner_id(e.target.value)
    const changeVetspireValue = (e) => setVetspireValue(e.target.value)


    return (
        <div className="middle">
            <div className="middleTitle">
                <p style={{ fontSize: px(28), fontWeight: "700" }}>
                    Integration
                </p>
            </div>
            <div className="switchBox">
                <div
                    className="left"
                    onClick={() => onSwitchIntegration('vetspire')}
                    style={{ backgroundColor: switchType === 'vetspire' ? '#e1206d' : '#ed4784' }}
                >
                    Vetspire
                </div>
                <div
                    className="right"
                    onClick={() => onSwitchIntegration('ezyvet')}
                    style={{ backgroundColor: switchType === 'ezyvet' ? '#e1206d' : '#ed4784' }}

                >
                    Ezyvet
                </div>
            </div>
            <div className="middleItemBox">
                <div className="middleItemLeft">
                    <div className="left">
                        <p>Test PMS Connection</p>
                    </div>
                    <div className="right">
                        {
                            switchType === 'vetspire' ? (
                                <Input placeholder="Insert API Key" value={vetspireValue} onChange={changeVetspireValue} />
                            ) : (
                                <>
                                    <Input placeholder="Insert Client ID" value={client_id} onChange={changeClientId} />
                                    <Input placeholder="Insert Client Secret" value={client_secret} onChange={changeClientSecret} />
                                    <Input placeholder="Insert Partner ID" value={partner_id} onChange={changePartnerId} />
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="middleItemRight">
                    <Button type="primary" shape="round" block onClick={test}>Test</Button>
                    <p>Help me connect to a PMS</p>
                    <Button type="primary" shape="round" block >Disconnect PMS</Button>
                </div>


            </div>
            <MyModal visible={loading} />
        </div>


    )
}
export default Integration;