import React from "react";
import YoutubeEmbed from "../../youtube/youtube";
import SpecialOfferModel from '../../../../03-back-end/src/components/special_offer/model';
import SpecialOfferService from "../../services/SpecialOfferService";
import { Row, Col, Container } from 'react-bootstrap';
import './SpecialOfferPage.sass';

const pathss: string = 'C:/Users/engin/OneDrive/Radna površina/aplikacija animatori/03-back-end/';

class SpecialOfferPageState {
    specialOffers: SpecialOfferModel[] = [];
    
}

export default class SpecialOfferPage extends React.Component{
    state: SpecialOfferPageState;

    constructor(props: any) {
        super(props);

        this.state = {
            specialOffers: [],
    
        };
    }

    private apiGetSpecialOffers() {
        SpecialOfferService.getSpecialOffers()
        .then(specialOffers => {
            if (specialOffers.length === 0) {
                return this.setState({
                    specialOffers: [],
                });
            }

            this.setState({
                specialOffers: specialOffers,
            });
        })
    }

    componentDidMount() {
        this.apiGetSpecialOffers();
  
    }

    
   

    renderSpecialOffer(): JSX.Element{
        return (
            <>
                {
                    this.state.specialOffers.length > 0
                    ? (
                        <>
                            
                                {
                                    this.state.specialOffers.map(
                                        specialOffer => (
                                            
                                            <div className="spec"  key={ "specialOfferDiv" + specialOffer.specialOfferId } style={{ backgroundImage: `url(${ 'http://localhost:4080/' + specialOffer.imagePath.replace('.jpg', '-offerBackground.jpg')})` }}>
                                                <div className="specWrapper clearfix">
                                                <h1>{specialOffer.name}</h1>
                                                <Row className="page-holder">
                                                    <Col className="page-body"
                                                        sm={ 12 }
                                                        md={ 6 }
                                                        lg={ 6 }>
                                                        <YoutubeEmbed embedId= {specialOffer.videoURL} />
                                                    </Col>

                                                    <Col className="page-sidebar"
                                                        sm={ 12 }
                                                        md={ 6 }
                                                        lg={ 6 }>
                                                            <p className="parag">
                                                        {
                                                            specialOffer.description
                                                        }
                                                            </p>
                                                    </Col>
                                                </Row>
                                   
                                                </div>
                                            </div>
                                            
                                        )
                                    )
                                }
                        </>
                    )
                    : ""
                }
            </>
        );
    }

    render(){
        return this.renderSpecialOffer();
    }
}